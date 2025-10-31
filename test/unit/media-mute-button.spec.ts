import { expect, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants.js';
import '../../src/js/media-mute-button.js';
import MediaMuteButton from '../../src/js/media-mute-button.js';
import { t } from '../../src/js/utils/i18n.js';

describe('<media-mute-button>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaMuteButton>(
      `<media-mute-button></media-mute-button>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  describe('default state', () => {
    let el: MediaMuteButton;

    beforeEach(async () => {
      el = await fixture(`<media-mute-button></media-mute-button>`);
    });

    it('should have aria-label "mute"', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('mute'));
    });

    it('should show the high icon slot by default', () => {
      const icon = el.shadowRoot?.querySelector('slot[name="icon"] slot[name="high"]');
      expect(icon).to.exist;
    });

    it('should dispatch MEDIA_MUTE_REQUEST on click', () => {
      const handler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_MUTE_REQUEST, handler);
      el.click();
      expect(handler.calledOnce).to.be.true;
    });
  });

  describe('muted state (mediavolumelevel="off")', () => {
    let el: MediaMuteButton;

    beforeEach(async () => {
      el = await fixture(
        `<media-mute-button ${MediaUIAttributes.MEDIA_VOLUME_LEVEL}="off"></media-mute-button>`
      );
    });

    it('should have aria-label "unmute"', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('unmute'));
    });

    it('should show the off icon slot', () => {
      const icon = el.shadowRoot?.querySelector('slot[name="icon"] slot[name="off"]');
      expect(icon).to.exist;
    });

    it('should dispatch MEDIA_UNMUTE_REQUEST on click', () => {
      const handler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_UNMUTE_REQUEST, handler);
      el.click();
      expect(handler.calledOnce).to.be.true;
    });
  });

  describe('volume levels (low, medium, high)', () => {
    const levels = ['low', 'medium', 'high'] as const;

    for (const level of levels) {
      describe(`when mediavolumelevel="${level}"`, () => {
        let el: MediaMuteButton;

        beforeEach(async () => {
          el = await fixture(
            `<media-mute-button ${MediaUIAttributes.MEDIA_VOLUME_LEVEL}="${level}"></media-mute-button>`
          );
        });

        it('should have aria-label "mute"', () => {
          expect(el.getAttribute('aria-label')).to.equal(t('mute'));
        });

        it(`should show only the ${level} icon`, () => {
          const visible = el.shadowRoot?.querySelector(
            `slot[name="icon"] slot[name="${level}"]`
          );
          expect(visible).to.exist;

          const others = ['off', 'low', 'medium', 'high'].filter(n => n !== level);
          others.forEach(name => {
            const hidden = el.shadowRoot?.querySelector(
              `slot[name="icon"] slot[name="${name}"]`
            );
            if (hidden) {
              const style = getComputedStyle(hidden);
              expect(style.display).to.equal('none');
            }
          });
        });
      });
    }
  });

  describe('attribute changes', () => {
    let el: MediaMuteButton;

    beforeEach(async () => {
      el = await fixture(`<media-mute-button></media-mute-button>`);
    });

    it('updates aria-label when mediavolumelevel changes dynamically', async () => {
      el.setAttribute(MediaUIAttributes.MEDIA_VOLUME_LEVEL, 'off');
      await new Promise(resolve => requestAnimationFrame(resolve));
      expect(el.getAttribute('aria-label')).to.equal(t('unmute'));

      el.setAttribute(MediaUIAttributes.MEDIA_VOLUME_LEVEL, 'low');
      await new Promise(resolve => requestAnimationFrame(resolve));
      expect(el.getAttribute('aria-label')).to.equal(t('mute'));
    });
  });

  describe.skip('custom slots', () => {
    it('should support custom off icon', async () => {
      const idStr = 'customOff';
      const slotStr = 'off';
      const el = await fixture<MediaMuteButton>(
        `<media-mute-button><span id="${idStr}" slot="${slotStr}">Muted</span></media-mute-button>`
      );
      const slottedEl = el?.shadowRoot?.querySelector(
        `slot[name="icon"] slot[name="${slotStr}"] > *`
      );
      expect(slottedEl).to.have.id(idStr);
    });

    it('should support custom low icon', async () => {
      const idStr = 'customLow';
      const slotStr = 'low';
      const el = await fixture<MediaMuteButton>(
        `<media-mute-button><span id="${idStr}" slot="${slotStr}">Low</span></media-mute-button>`
      );
      const slottedEl = el?.shadowRoot?.querySelector(
        `slot[name="icon"] slot[name="${slotStr}"] > *`
      );
      expect(slottedEl).to.have.id(idStr);
    });
  });
});
