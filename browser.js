function postSignal(name) {
  var password = document.getElementById('password').value;
  if(password == null || password == "") {
    alert("You must enter a password to evaluate code.");
  }
  else {
    $.post(name + "-" + password, function(x) {});
  }
}

function openEditor(name) {
  sharejs.open(name,'text',function(error,doc) {
    if(error) console.log(error);
    else {
      var elem = document.getElementById(name);
      elem.disabled = false;
      doc.attach_textarea(elem);
    }
  });
}

function setup() {
  openEditor('edit1');
  openEditor('edit2');
  openEditor('edit3');
  openEditor('edit4');
  openEditor('edit5');
  openEditor('edit6');
  openEditor('edit7');
  openEditor('edit8');
  openEditor('edit9');
  openEditor('chat');
}
