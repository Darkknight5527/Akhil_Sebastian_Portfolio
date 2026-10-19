function sendMessage(){
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const msg     = document.getElementById('cf-msg').value.trim();
  const status  = document.getElementById('cf-status');
  const btn     = document.getElementById('cf-btn');

  if(!name||!email||!subject||!msg){
    status.style.display='block';
    status.style.color='#ff6b6b';
    status.textContent='// Please fill in all fields';
    return;
  }

  const mailto = `mailto:sskzm5527@gmail.com?subject=${encodeURIComponent(subject + ' — from ' + name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg)}`;
  window.location.href = mailto;

  const label = btn.querySelector('.cf-label') || btn; // running-border version keeps its layers
  label.textContent = 'Message Sent ✓';
  btn.classList.add('sent');
  status.style.display='block';
  status.style.color='var(--g)';
  status.textContent='// Opening your mail client...';

  setTimeout(()=>{
    label.textContent='Send Message →';
    btn.classList.remove('sent');
    status.style.display='none';
  }, 3000);
}
