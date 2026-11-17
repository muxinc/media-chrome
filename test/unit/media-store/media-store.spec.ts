import { expect } from '@open-wc/testing';
import { createMediaStore } from '../../../src/js/media-store/media-store.js';

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

class StateOwner extends EventTarget {
  value = 0;
  listeners = new Set<EventListenerOrEventListenerObject>();

  override addEventListener(
    type: string,
    handler: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ) {
    if (handler) this.listeners.add(handler);
    super.addEventListener(type, handler, options);
  }

  override removeEventListener(
    type: string,
    handler: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions
  ) {
    if (handler) this.listeners.delete(handler);
    super.removeEventListener(type, handler, options);
  }
}

const createOwners = () => ({
  media: Object.assign(new StateOwner(), {
    textTracks: new StateOwner(),
    videoRenditions: new StateOwner(),
    audioTracks: new StateOwner(),
    remote: new StateOwner(),
  }),
  documentElement: new StateOwner(),
});

const targets = ({
  media,
  documentElement,
}: ReturnType<typeof createOwners>) => [
  media,
  media.textTracks,
  media.videoRenditions,
  media.audioTracks,
  media.remote,
  documentElement,
];

const expectListeners = (
  owners: ReturnType<typeof createOwners>,
  count: number
) => {
  targets(owners).forEach((owner) => {
    expect(owner.listeners.size).to.equal(count);
  });
};

const createStore = (
  owners: ReturnType<typeof createOwners>,
  config: Parameters<typeof createMediaStore>[0] = {}
) => {
  let customMonitors = 0;
  const store = createMediaStore({
    ...owners,
    stateMediator: {
      mediaCurrentTime: {
        get: ({ media }: { media: StateOwner }) => media.value,
        mediaEvents: ['timeupdate'],
        textTracksEvents: ['change'],
        videoRenditionsEvents: ['change'],
        audioTracksEvents: ['change'],
        remoteEvents: ['change'],
        rootEvents: ['change'],
        stateOwnersUpdateHandlers: [
          () => {
            customMonitors++;
            return () => customMonitors--;
          },
        ],
      },
    } as any,
    requestMap: {} as Parameters<typeof createMediaStore>[0]['requestMap'],
    ...config,
  });
  return { store, customMonitors: () => customMonitors };
};

let customElementId = 0;
const pendingMedia = () => {
  const name = `pending-store-media-${customElementId++}`;
  const media = document.createElement(name);
  return {
    media,
    define: () => customElements.define(name, class extends HTMLElement {}),
  };
};

describe('MediaStore subscription monitoring', () => {
  it('updates subscribed state and stops calling a removed subscriber', async () => {
    const owners = createOwners();
    const { store } = createStore(owners);
    await settle();
    let calls = 0;
    const unsubscribe = store.subscribe(() => calls++);
    await settle();
    owners.media.value = 1;
    owners.media.dispatchEvent(new Event('timeupdate'));
    expect(store.getState().mediaCurrentTime).to.equal(1);
    expect(calls).to.equal(2);
    unsubscribe();
    await settle();
    owners.media.value = 2;
    owners.media.dispatchEvent(new Event('timeupdate'));
    expect(calls).to.equal(2);
  });

  it('keeps monitoring without subscriptions when explicitly configured', async () => {
    const owners = createOwners();
    const { store, customMonitors } = createStore(owners, {
      monitorStateOwnersOnlyWithSubscriptions: false,
    });
    await settle();
    expectListeners(owners, 1);
    const unsubscribe = store.subscribe(() => {});
    await settle();
    unsubscribe();
    await settle();
    expectListeners(owners, 1);
    expect(customMonitors()).to.equal(1);
    owners.media.value = 2;
    owners.media.dispatchEvent(new Event('timeupdate'));
    expect(store.getState().mediaCurrentTime).to.equal(2);
  });

  it('tears down all owners and custom monitors after the last unsubscribe', async () => {
    const owners = createOwners();
    const { store, customMonitors } = createStore(owners);
    await settle();
    const unsubscribe = store.subscribe(() => {});
    await settle();
    expectListeners(owners, 1);
    expect(customMonitors()).to.equal(1);
    owners.media.value = 1;
    owners.media.dispatchEvent(new Event('timeupdate'));
    unsubscribe();
    await settle();
    expectListeners(owners, 0);
    expect(customMonitors()).to.equal(0);
    owners.media.value = 2;
    targets(owners).forEach((owner) => {
      owner.dispatchEvent(new Event('timeupdate'));
      owner.dispatchEvent(new Event('change'));
    });
    expect(store.getState().mediaCurrentTime).to.equal(1);
  });

  it('starts monitoring again after resubscribing', async () => {
    const owners = createOwners();
    const { store, customMonitors } = createStore(owners);
    const unsubscribe = store.subscribe(() => {});
    await settle();
    unsubscribe();
    await settle();
    const unsubscribeAgain = store.subscribe(() => {});
    await settle();
    expectListeners(owners, 1);
    expect(customMonitors()).to.equal(1);
    owners.media.value = 3;
    owners.media.dispatchEvent(new Event('timeupdate'));
    expect(store.getState().mediaCurrentTime).to.equal(3);
    unsubscribeAgain();
    await settle();
    expectListeners(owners, 0);
    expect(customMonitors()).to.equal(0);
  });

  it('waits for the last of multiple subscribers and tolerates repeated unsubscribe', async () => {
    const owners = createOwners();
    const { store, customMonitors } = createStore(owners);
    await settle();
    const unsubscribe = store.subscribe(() => {});
    const unsubscribeAgain = store.subscribe(() => {});
    await settle();
    unsubscribe();
    unsubscribe();
    await settle();
    expectListeners(owners, 1);
    expect(customMonitors()).to.equal(1);
    unsubscribeAgain();
    await settle();
    expectListeners(owners, 0);
    expect(customMonitors()).to.equal(0);
  });

  it('does not start monitoring with no subscribers, including synchronous churn', async () => {
    const owners = createOwners();
    const { store, customMonitors } = createStore(owners);
    const unsubscribe = store.subscribe(() => {});
    unsubscribe();
    await settle();
    expectListeners(owners, 0);
    expect(customMonitors()).to.equal(0);
  });

  it('coalesces unsubscribe and resubscribe without duplicating monitors', async () => {
    const owners = createOwners();
    const { store, customMonitors } = createStore(owners);
    const unsubscribe = store.subscribe(() => {});
    await settle();
    unsubscribe();
    const unsubscribeAgain = store.subscribe(() => {});
    await settle();
    expectListeners(owners, 1);
    expect(customMonitors()).to.equal(1);
    unsubscribeAgain();
    await settle();
    expectListeners(owners, 0);
  });

  it('uses the latest subscription count while an owner is being prepared', async () => {
    const owners = createOwners();
    const pending = pendingMedia();
    const { store, customMonitors } = createStore(owners);
    const unsubscribe = store.subscribe(() => {});
    await settle();
    store.dispatch({
      type: 'mediaelementchangerequest',
      detail: pending.media,
    });
    unsubscribe();
    const unsubscribeAgain = store.subscribe(() => {});
    unsubscribeAgain();
    pending.define();
    await settle();
    expectListeners(owners, 0);
    expect(customMonitors()).to.equal(0);
    const unsubscribeFinal = store.subscribe(() => {});
    await settle();
    expect(customMonitors()).to.equal(1);
    unsubscribeFinal();
    await settle();
    expect(customMonitors()).to.equal(0);
  });

  it('tears down and restores current monitoring while a replacement is still pending', async () => {
    const owners = createOwners();
    const pending = pendingMedia();
    const { store, customMonitors } = createStore(owners);
    const unsubscribe = store.subscribe(() => {});
    await settle();
    store.dispatch({
      type: 'mediaelementchangerequest',
      detail: pending.media,
    });
    try {
      unsubscribe();
      await settle();
      expectListeners(owners, 0);
      expect(customMonitors()).to.equal(0);
      const unsubscribeAgain = store.subscribe(() => {});
      await settle();
      expectListeners(owners, 1);
      expect(customMonitors()).to.equal(1);
      owners.media.value = 4;
      owners.media.dispatchEvent(new Event('timeupdate'));
      expect(store.getState().mediaCurrentTime).to.equal(4);
      unsubscribeAgain();
      await settle();
      expectListeners(owners, 0);
      expect(customMonitors()).to.equal(0);
    } finally {
      pending.define();
    }
    await settle();
    expectListeners(owners, 0);
    expect(customMonitors()).to.equal(0);
  });

  it('replaces monitored owners and their listeners', async () => {
    const owners = createOwners();
    const replacement = createOwners();
    const { store, customMonitors } = createStore(owners);
    const unsubscribe = store.subscribe(() => {});
    await settle();
    store.dispatch({
      type: 'mediaelementchangerequest',
      detail: replacement.media,
    });
    store.dispatch({
      type: 'documentelementchangerequest',
      detail: replacement.documentElement,
    });
    await settle();
    expectListeners(owners, 0);
    expectListeners(replacement, 1);
    expect(customMonitors()).to.equal(1);
    unsubscribe();
    await settle();
    expectListeners(replacement, 0);
    expect(customMonitors()).to.equal(0);
  });

  it('handles an unsubscribe triggered by projecting a replacement owner', async () => {
    const owners = createOwners();
    const replacement = createOwners();
    replacement.media.value = 1;
    const { store, customMonitors } = createStore(owners);
    let unsubscribe = () => {};
    unsubscribe = store.subscribe((state) => {
      if (state.mediaCurrentTime === 1) unsubscribe();
    });
    await settle();
    store.dispatch({
      type: 'mediaelementchangerequest',
      detail: replacement.media,
    });
    await settle();
    expectListeners(owners, 0);
    expectListeners(
      { ...replacement, documentElement: owners.documentElement },
      0
    );
    expect(customMonitors()).to.equal(0);
  });

  it('prepares the latest owner when replacements coalesce', async () => {
    const owners = createOwners();
    const first = pendingMedia();
    const last = pendingMedia();
    const seen: unknown[] = [];
    const { store } = createStore(owners, {
      stateMediator: {
        mediaCurrentTime: {
          get: ({ media }: { media?: HTMLMediaElement }) => media?.currentTime,
          stateOwnersUpdateHandlers: [
            (_handler: unknown, { media }: { media: unknown }) => {
              seen.push(media);
            },
          ],
        },
      } as any,
    });
    const unsubscribe = store.subscribe(() => {});
    await settle();
    store.dispatch({ type: 'mediaelementchangerequest', detail: first.media });
    store.dispatch({ type: 'mediaelementchangerequest', detail: last.media });
    first.define();
    await settle();
    expect(seen.includes(last.media)).to.equal(false);
    last.define();
    await settle();
    expect(seen.includes(last.media)).to.equal(true);
    unsubscribe();
  });

  it('does not wait for an obsolete owner before applying a ready replacement', async () => {
    const owners = createOwners();
    const replacement = createOwners();
    const obsolete = pendingMedia();
    const { store, customMonitors } = createStore(owners);
    const unsubscribe = store.subscribe(() => {});
    await settle();
    store.dispatch({
      type: 'mediaelementchangerequest',
      detail: obsolete.media,
    });
    store.dispatch({
      type: 'mediaelementchangerequest',
      detail: replacement.media,
    });
    await settle();
    expectListeners(
      { ...replacement, documentElement: owners.documentElement },
      1
    );
    expect(customMonitors()).to.equal(1);
    obsolete.define();
    await settle();
    expectListeners(
      { ...replacement, documentElement: owners.documentElement },
      1
    );
    expect(customMonitors()).to.equal(1);
    unsubscribe();
    await settle();
    expectListeners(
      { ...replacement, documentElement: owners.documentElement },
      0
    );
  });

  it('stops default mediator updates from an actual video element', async () => {
    const media = document.createElement('video');
    const store = createMediaStore({ media, documentElement: document });
    await settle();
    let calls = 0;
    const unsubscribe = store.subscribe(() => calls++);
    await settle();
    media.currentTime = 1;
    media.dispatchEvent(new Event('timeupdate'));
    expect(store.getState().mediaCurrentTime).to.equal(1);
    const subscribedCalls = calls;
    unsubscribe();
    await settle();
    media.currentTime = 2;
    media.dispatchEvent(new Event('timeupdate'));
    expect(calls).to.equal(subscribedCalls);
    expect(store.getState().mediaCurrentTime).to.equal(1);
    const unsubscribeAgain = store.subscribe(() => {});
    await settle();
    expect(store.getState().mediaCurrentTime).to.equal(2);
    unsubscribeAgain();
  });
});
