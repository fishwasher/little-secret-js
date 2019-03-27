<?php
/*
A simple 'secret notebook' demo application in PHP
(c)2019 Vlad Podvorny
*/

// redirect to itself via GET
function reload() {
  if ('GET' == $_SERVER['REQUEST_METHOD'] && empty($_GET)) exit;
  $path = $_SERVER['PHP_SELF'];
  header("Location: " . $path . '?t=' . time());
  exit;
}

# we're tracking login session so nobody would overwrite our secrets
session_start();

# providing very basic login
$login = ['user' => 'password']; #<-------------------- username and password :)
$handler = $_SERVER['PHP_SELF'];

if (empty($_SESSION['user'])) {
  // they might submitted login form via POST, let's process it
  if ('POST' == $_SERVER['REQUEST_METHOD']) {
    $user = isset($_POST['user']) ? $_POST['user'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    if ($user && $password && isset($login[$user]) && $login[$user] === $password) {
      $_SESSION['user'] = $user; // success, welcome on board (on the next round)!
    }
    reload(); // redirect to itself via GET
  }
  // send back the login page
?><!doctype html><html lang="en"><head><meta charset="utf-8"><title>Login</title></head>
<body>
  <form method="POST" action="<?php echo $handler; ?>">
    <p>Username: <input name="user"></p><p>Password: <input type="password" name="password"></p><p><input type="submit" value="Sign In"></p>
  </form>
</body></html>

<?php
  exit; #<-------------------- not logged in, stop right here
}

# welcome dear logged in user!

$datafile = __DIR__ . '/__data.txt'; // here we store encoded secret data
$datakey = 'mydata'; // POST data key

// processing data upload via POST
if ('POST' == $_SERVER['REQUEST_METHOD']) {
  $res = false;
  if (isset($_POST[$datakey])) {
    $res = @file_put_contents($datafile, $_POST[$datakey]);
  }
  $_SESSION['updated'] = $res;
  reload();
}

#--------------------- processing logout
if (isset($_GET['logout'])) {
  $_SESSION = null;
  session_destroy();
  reload();
}
#---------------------

$upd_stat = ''; #<---------- action success message from session
if (isset($_SESSION['updated'])) {
  $upd_stat = $_SESSION['updated'] === false ? 'update failed' : $_SESSION['updated'] . ' bytes written';
  unset($_SESSION['updated']);
}

#---------------------- getting encoded text from the data file, if any
$encoded_data = file_exists($datafile) ? file_get_contents($datafile) : '';

#-------------------------- rendering HTML page with encoded data in
?><!doctype html><html lang="en">
<head>
<meta charset="utf-8">
<title>Secret Notes</title>
<style>
    body {font: 12pt sans-serif}
    .status {font: 12pt monospace; color:#c00}
</style>
<script src="lscoder.min.js"></script>
</head>
<body>
<p><a href="<?php echo $handler; ?>?logout=1">Sign Out</a></p>
<p>Secret: <input id="secret-input" type="text"> <button id="btn-apply">Apply</button> </p>
<div><textarea id="text-decoded" cols="64" rows="10"></textarea></div>
<div><button id="btn-save">Save</button></div>
<p id="text-status"></p>
<script type="text/garbage" id="message-container"><?php echo $upd_stat; ?></script>
<script type="text/garbage" id="data-container"><?php echo $encoded_data; ?></script>
<script>
!function(){
  'use strict';

  var coder = null, decoded = false;

  var applySecret = function(s) {
    if (s) {
      coder = new LittleSecret(s);
      if (!decoded) decoded = decode();
      showStatus('Secret applied');
    } else {
      document.getElementById('secret-applied').innerText = 'Secret is empty';
      showStatus('Secret is empty');
    }
  };

  var decode = function() {
    if (coder) {
      var text = document.getElementById('data-container').innerHTML.trim();
      if (text.length) text = coder.decode(text);
      document.getElementById('text-decoded').value = text;
      return true;
    }
    showStatus('Enter secret to activate coder');
    return false;
  };

  var update = function() {
    if (coder) {
      var text = document.getElementById('text-decoded').value;
      if (text.length) text = coder.encode(text);
      var form = document.createElement('form'),
      input = document.createElement('input');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', '<?php echo $handler; ?>');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', '<?php echo $datakey; ?>');
      input.setAttribute('value', text);
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } else {
      showStatus('Apply secret to activate coder');
    }
  };

  var showStatus = function(msg) {
    if (!msg) return;
    var el = document.createElement('p');
    el.setAttribute('class', 'status');
    el.innerText = msg;
    document.body.appendChild(el);
    setTimeout(function() {
      document.body.removeChild(el);
    }, 2000);
  };

  window.addEventListener('load', function() {
    showStatus(document.getElementById('message-container').innerHTML.trim());

    var secret = window.sessionStorage && window.sessionStorage.getItem('secret') || '';
    if (secret) {
      applySecret(secret);
    }

    document.getElementById('btn-apply').addEventListener('click', function(){
      secret =  document.getElementById('secret-input').value;
      if (window.sessionStorage) {
        window.sessionStorage.setItem('secret', secret);
      }
      applySecret(secret);
    });

    document.getElementById('btn-save').addEventListener('click', function(){
      update();
    });
  });
}();
</script>
</body>
</html>
