// CLIENT_SEND_MASSAGE
const formSendData = document.querySelector('.chat .inner-form');
if (formSendData) {
  formSendData.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if (content) {
      socket.emit('CLIENT_SEND_MASSAGE', content);
      e.target.elements.content.value = '';
    };
  });
};
// END CLIENT_SEND_MASSAGE

// SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
  const myId = document.querySelector('[my-id]').getAttribute('my-id');
  const body = document.querySelector('.chat .inner-body');

  const div = document.createElement('div');
  let htmlFullName = "";

  if (myId == data.userId) {
    div.classList.add('inner-outgoing');
  } else {
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    div.classList.add('inner-incoming');
  }
  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;

  body.appendChild(div);

  body.scrollTop = body.scrollHeight;
})
// END SERVER_RETURN_MESSAGE

// scroll chat to bottom
const bodyChat = document.querySelector('.chat .inner-body');

if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// end scroll chat to bottom