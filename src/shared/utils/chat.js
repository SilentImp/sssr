import Config from 'Config';

export const openChat = ({ chatRoom = '', email = '', nickname = '' }) => {
  const left = window
    ? (window.innerWidth / 2) - (600 / 2)
    : 0;
  const top = window
    ? (window.innerHeight / 2) - (720 / 2)
    : 0;

  return window.open(
    `${Config.chatURL}?${chatRoom ? `&room=${chatRoom}` : ''}${email ? `&email=${email}` : ''}${nickname ? `&nick=${nickname}` : ''}`,
    'Template-Help.com Live Chat',
    `width=600, height=720, left=${left}px, top=${top}px, resizable=no`,
  );
};

export default openChat;
