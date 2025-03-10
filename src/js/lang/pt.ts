import { addTranslation } from '../utils/i18n.js';
import type { TranslateDictionary } from '../lang/en.js';

export const Pt: TranslateDictionary = {
  'Start airplay': 'Iniciar AirPlay',
  'Stop airplay': 'Parar AirPlay',
  Audio: 'Áudio',
  Captions: 'Legendas',
  'Enable captions': 'Ativar legendas',
  'Disable captions': 'Desativar legendas',
  'Start casting': 'Iniciar transmissão',
  'Stop casting': 'Parar transmissão',
  'Enter fullscreen mode': 'Entrar no modo de tela cheia',
  'Exit fullscreen mode': 'Sair do modo de tela cheia',
  Mute: 'Silenciar',
  Unmute: 'Ativar som',
  'Enter picture in picture mode': 'Entrar no modo PiP (Imagem na tela)',
  'Exit picture in picture mode': 'Sair do modo PiP',
  Play: 'Reproduzir',
  Pause: 'Pausar',
  'Playback rate': 'Taxa de reprodução',
  'Playback rate {playbackRate}': 'Taxa de reprodução {playbackRate}',
  Quality: 'Qualidade',
  'Seek backward': 'Retroceder',
  'Seek forward': 'Avançar',
  Settings: 'Configurações',
  'audio player': 'reprodutor de áudio',
  'video player': 'reprodutor de vídeo',
  volume: 'volume',
  seek: 'buscar',
  'closed captions': 'legendas ocultas',
  'current playback rate': 'taxa de reprodução atual',
  'playback time': 'tempo de reprodução',
  'media loading': 'carregando mídia',

  settings: 'configurações',
  'audio tracks': 'faixas de áudio',
  quality: 'qualidade',
  play: 'reproduzir',
  pause: 'pausar',
  mute: 'silenciar',
  unmute: 'ativar som',
  live: 'ao vivo',
  'start airplay': 'iniciar AirPlay',
  'stop airplay': 'parar AirPlay',
  'start casting': 'iniciar transmissão',
  'stop casting': 'parar transmissão',
  'enter fullscreen mode': 'entrar no modo de tela cheia',
  'exit fullscreen mode': 'sair do modo de tela cheia',
  'enter picture in picture mode': 'entrar no modo PiP',
  'exit picture in picture mode': 'sair do modo PiP',
  'seek to live': 'buscar ao vivo',
  'playing live': 'reproduzindo ao vivo',
  'seek back {seekOffset} seconds': 'voltar {seekOffset} segundos',
  'seek forward {seekOffset} seconds': 'avançar {seekOffset} segundos',
  'Network Error': 'Erro de rede',
  'Decode Error': 'Erro de decodificação',
  'Source Not Supported': 'Fonte não suportada',
  'Encryption Error': 'Erro de criptografia',
  'A network error caused the media download to fail.':
    'Um erro de rede causou a falha no download do conteúdo.',
  'A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.':
    'Um erro de mídia fez com que a reprodução fosse interrompida. O conteúdo pode estar corrompido ou seu navegador não suporta este formato.',
  'An unsupported error occurred. The server or network failed, or your browser does not support this format.':
    'Ocorreu um erro de incompatibilidade. O servidor ou a rede falharam, ou seu navegador não suporta este formato.',
  'The media is encrypted and there are no keys to decrypt it.':
    'O conteúdo está criptografado e não há chaves disponíveis para descriptografá-lo.',
};
addTranslation('pt', Pt);
