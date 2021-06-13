const Peer = window.Peer;

(async function main() {

  const localVideo = document.getElementById('js-local-video');// 音声・映像を取得
  const localId = document.getElementById('js-local-id');// 自身のidを取得
  const videosContainer = document.getElementById('js-videos-container');// 映像配置
  const peer1Container = document.getElementById('js-peer1-container');// 参加者1の映像を配置
  // const peer2Container = document.getElementById('js-peer2-container');// 参加者2の映像を配置
  // const peer3Container = document.getElementById('js-peer3-container');// 参加者3の映像を配置
  const status = document.getElementById('status');
  const homeTrigger = document.getElementById('js-home-trigger');// 参加ボタン
  const joinTrigger = document.getElementById('js-join-trigger');// 参加ボタン
  const leaveTrigger = document.getElementById('js-leave-trigger');// 退出ボタン
  const copyTrigger = document.getElementById('js-copy-trigger');//コピーボタン
  const saveTrigger = document.getElementById('js-save-trigger');//保存ボタン
  const messages = document.getElementById('js-messages');// メッセージ欄
  const localText = document.getElementById('result_text'); // テキスト欄
  const localText2 = document.getElementById('result_text2'); // テキスト欄2
  const localText3 = document.getElementById('result_text3'); // テキスト欄3
  const localText4 = document.getElementById('result_text4'); // テキスト欄4
  const messageController = document.getElementById('messages-controller');
  const sendTrigger = document.getElementById('js-send-trigger'); // Sendトリガー
  const MAX_MENBER = 1;
  var roomMembers = 0;
  
  document.getElementById('status').innerHTML = "停止中";
  var open = new Audio('open.mp3');
  var close = new Audio('close.mp3');

  var userAgent = window.navigator.userAgent.toLowerCase();
  if(navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/)){
      redirect();
  } else if (userAgent.indexOf('chrome') == -1) {
      redirect();
  }
  function redirect(){
      alert("本サービスはPC版Google Chromeのみ対応しています");
  }

  var roomId = window.location.hash; 
  if(window.location.hash.length!=10) {
    // roomIdをランダム生成
    roomId = '';
    var l = 9;
    var c = "abcdefghijklmnopqrstuvwxyz0123456789";
    var cl = c.length;
    for(var i=0; i<l; i++){
      roomId += c[Math.floor(Math.random()*cl)];
    }
    window.location.hash = roomId;
  }

  // メディア（音声・映像を取得して配置）
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  localVideo.srcObject = localStream;

  // 自身のpeerIDを取得
  const peer = new Peer({
    key: '40e16081-d52e-4831-b239-00fb3afbe900',
    debug: 3,
  });

  homeTrigger.disabled = true;
  joinTrigger.disabled = true;
  leaveTrigger.disabled = true;
  sendTrigger.disabled = true;
  copyTrigger.disabled = true;
  saveTrigger.disabled = true;
  localText.disabled = true;

  homeTrigger.style.opacity = "0.1";
  joinTrigger.style.opacity = "0.1";
  leaveTrigger.style.opacity = "0.1";
  sendTrigger.style.opacity = "0.1";
  copyTrigger.style.opacity = "0.1";
  saveTrigger.style.opacity = "0.1";
  localText.style.opacity = "0.3";

  copyTrigger.addEventListener('click', () => {
    var urltext = document.createElement("textarea");
    urltext.value = window.location;
    document.body.appendChild(urltext);
    urltext.select();
    document.execCommand("copy");
    urltext.parentElement.removeChild(urltext);
    alert("招待URLをコピーしました");
  });

  saveTrigger.addEventListener('click', () => {
    var name = '会話記録';
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var blob = new Blob( [bom, messages.innerHTML], {type: 'text/txt' } )
    var link = document.getElementById('DL_link')
    link.href = window.URL.createObjectURL(blob)
    link.download = name + '.txt'
    link.click()
    saveTrigger.blur();
  });


  joinTrigger.addEventListener('click', () => {
    alert('ルームに参加しました');
    joinButton();
  });

  localVideo.onloadedmetadata = (event) => {
    var result = confirm('ルームに参加しますか？');
    if(result) {
      setTimeout(joinButton, 500);
      homeTrigger.disabled = true;
      joinTrigger.disabled = true;
      leaveTrigger.disabled = false;
      sendTrigger.disabled = false;
      copyTrigger.disabled = false;
      saveTrigger.disabled = false;
      localText.disabled = false;

      homeTrigger.style.opacity = "0.1";
      joinTrigger.style.opacity = "0.1";
      leaveTrigger.style.opacity = "1";
      sendTrigger.style.opacity = "1";
      copyTrigger.style.opacity = "1";
      saveTrigger.style.opacity = "1";
      localText.style.opacity = "0.9";
    } else {
      homeTrigger.disabled = false;
      joinTrigger.disabled = false;
      leaveTrigger.disabled = true;
      sendTrigger.disabled = true;
      copyTrigger.disabled = true;
      saveTrigger.disabled = true;
      localText.disabled = true;

      homeTrigger.style.opacity = "1";
      joinTrigger.style.opacity = "1";
      leaveTrigger.style.opacity = "0.1";
      sendTrigger.style.opacity = "0.1";
      copyTrigger.style.opacity = "0.1";
      saveTrigger.style.opacity = "0.1";
      localText.style.opacity = "0.3";
    }
    joinTrigger.blur();
    copyTrigger.blur();
    sendTrigger.blur();
    saveTrigger.blur();
    leaveTrigger.blur();
  };

  // 自身のpeerIDを取得を発火
  peer.on('open', (id) => {
    localId.textContent = id;
  });

  function joinButton() {
    homeTrigger.disabled = true;
    joinTrigger.disabled = true;
    leaveTrigger.disabled = false;
    sendTrigger.disabled = false;
    copyTrigger.disabled = false;
    saveTrigger.disabled = false;
    localText.disabled = false;

    homeTrigger.style.opacity = "0.1";
    joinTrigger.style.opacity = "0.1";
    leaveTrigger.style.opacity = "1";
    sendTrigger.style.opacity = "1";
    copyTrigger.style.opacity = "1";
    saveTrigger.style.opacity = "1";
    localText.style.opacity = "0.9";

    // ルームの設定
    const room = peer.joinRoom(window.location.hash, {
      mode: 'mesh',
      stream: localStream,
    });

    // ルームに参加するとテキスト入力
    room.on('open', () => {
      messages.textContent += `===あなたが参加しました===\n`;
      messageController.scrollTop = messageController.scrollHeight;
    });

    // 他者がルームに参加したときの処理
    room.on('peerJoin', peerId => {
      open.play();  // 再生
      messages.textContent += `===${peerId}が参加しました===\n`;
      messageController.scrollTop = messageController.scrollHeight;
      if(roomMembers >= MAX_MENBER) {
        messages.textContent += `${peerId}さんが入室できませんでした\n`;
        room.send(`${peerId}さんが入室できませんでした`);
      }
    });
    
    room.on('data', function(msg) {
      myId = localId.textContent;
      if(msg.data == `${myId}さんが入室できませんでした`) {
        room.close();
        window.location.href = "https://yukihara9294.github.io/textcall/";
        alert('ルーム人数の上限に達しているので参加できません');
      }
    });

    room.on('stream', async stream => {
      const remoteVideo = document.createElement('video');
      remoteVideo.className = "video";
      remoteVideo.style.filter = "brightness(70%)";
      remoteVideo.srcObject = stream;
      remoteVideo.playsInline = true;
      remoteVideo.setAttribute('data-peer-id', stream.peerId);
      peer1Container.append(remoteVideo);
      roomMembers += 1;
      await remoteVideo.play().catch(console.error);
    });

    function reset3() { localText3.textContent = '';}
    room.on('data', ({ data, src }) => {
      // Show a message sent to the room and who sent
      console.log(data);
      if (src != peer.id) {
        messageController.scrollTop = messageController.scrollHeight;
        messages.textContent += `相手 : ${data}\n`;
        localText3.textContent = data;
        setTimeout(reset3, 3000);
      }
      messageController.scrollTop = messageController.scrollHeight;
    });

    // 他者が退室したときの処理
    room.on('peerLeave', peerId => {
      roomMembers -= 1;
      const remoteVideo = peer1Container.querySelector(`[data-peer-id="${peerId}"]`);
      remoteVideo.srcObject.getTracks().forEach(track => {
        track.stop();
      });
      remoteVideo.srcObject = null;
      remoteVideo.remove();
      messages.textContent += `===${peerId}が退出しました===\n`;
      messageController.scrollTop = messageController.scrollHeight;
      close.play();  // 再生


    });

    room.once('close', () => {
      // 自身が退室したときの処理
      roomMembers = 0;
      close.play();  // 再生
      sendTrigger.removeEventListener('click', onClick);
      messages.textContent += '===あなたが退出しました===\n';
      messageController.scrollTop = messageController.scrollHeight;
      const remoteVideos = peer1Container.querySelectorAll('[data-peer-id]');
      Array.from(remoteVideos)
        .forEach(remoteVideo => {
          remoteVideo.srcObject.getTracks().forEach(track => track.stop());
          remoteVideo.srcObject = null;
          remoteVideo.remove();
      });
    });

    homeTrigger.addEventListener('click', () => {
      var result = confirm('ホームに戻りますか？');
      if(result) {
        window.location.href = "https://yukihara9294.github.io/textcall/";
      } else {
        return 0;
      }
      homeTrigger.blur();
      joinTrigger.blur();
      copyTrigger.blur();
      sendTrigger.blur();
      saveTrigger.blur();
      leaveTrigger.blur();
    });
  

    sendTrigger.addEventListener('click', onClick);
    leaveTrigger.addEventListener('click', () => {
      event.stopPropagation();
      homeTrigger.disabled = false;
      joinTrigger.disabled = false;
      leaveTrigger.disabled = true;
      sendTrigger.disabled = true;
      copyTrigger.disabled = true;
      saveTrigger.disabled = true;
      localText.disabled = true;

      homeTrigger.style.opacity = "1";
      joinTrigger.style.opacity = "1";
      leaveTrigger.style.opacity = "0.1";
      sendTrigger.style.opacity = "0.1";
      copyTrigger.style.opacity = "0.1";
      saveTrigger.style.opacity = "0.1";
      localText.style.opacity = "0.3";

      room.close();
      alert('ルームから退出しました');
      joinTrigger.blur();
      copyTrigger.blur();
      saveTrigger.blur();
      leaveTrigger.blur()
    }, { once: true });

    // 音声認識
    speReco();
    var flag_speech = 0;
    
    function speReco() {
      window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
      var recognition = new webkitSpeechRecognition();
      recognition.lang = 'Ja';
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onsoundstart = function() {
        status.innerHTML = "認識中";
        status.style.color = "#fc6a6a";
        status.style.borderColor = "#fc6a6a";

      };

      recognition.onnomatch = function() {        
        document.getElementById('status').innerHTML = "エラー";
      };
    
      recognition.onerror = function() {
        document.getElementById('status').innerHTML = "エラー";
        if(flag_speech == 0) {
          speReco();
        }
      };
    
      recognition.onsoundend = function() {
        document.getElementById('status').innerHTML = "停止中";
        speReco();
      };

      recognition.onresult = function(event) {
        var results = event.results;
        for (var i = event.resultIndex; i < results.length; i++) {
          if (results[i].isFinal) {
            localText.value = results[i][0].transcript;
            localText2.innerHTML = results[i][0].transcript;
            vr_function();
          }
          else {
            localText4.textContent = '';
            localText.value = results[i][0].transcript;
            localText2.innerHTML = results[i][0].transcript;
            if (i >= 45) {
              vr_function();
              speReco();
            }
            flag_speech = 1;
          }
        }
      }
      flag_speech = 0;
      document.getElementById('status').innerHTML = "待機中";
      status.style.color = "#abff7a";
      status.style.borderColor = "#abff7a";
      recognition.start();
      joinTrigger.blur();
      copyTrigger.blur();
      saveTrigger.blur();
      leaveTrigger.blur();
    }

    function reset4() { localText4.textContent = ''; }
    function vr_function() {
      // メッセージ欄にtext欄を転送
      room.send(localText.value);
      messages.textContent += `あなた: ${localText.value}\n`;
      localText4.textContent = localText.value;
      setTimeout(reset4, 3000);
      localText.value = '';
      localText2.innerHTML = '';
      messageController.scrollTop = messageController.scrollHeight;
      speReco();
    } 

    function onClick() {
      // sendTrigerをクリック
      room.send(localText.value);
      messages.textContent += `あなた: ${localText.value}\n`;
      localText4.textContent = localText.value;
      setTimeout(reset4, 3000);
      localText.value = '';
      localText2.innerHTML = '';
      speReco();
      joinTrigger.blur();
      copyTrigger.blur();
      sendTrigger.blur();
      saveTrigger.blur();
      leaveTrigger.blur();
      messageController.scrollTop = messageController.scrollHeight;
    }

    document.onkeydown = function(e) {
      var keyCode = false;
      if (e) event = e;
      if (event) {
          if (event.keyCode) {
              keyCode = event.keyCode;
          } else if (event.which) {
              keyCode = event.which;
          }
      }

      if (localText.value == '') {
        localText2.innerHTML = '';
      } else if (keyCode == 8) {
          localText2.textContent = '';
          localText.value = '';
          speReco();
        } else if (keyCode == 13) {
          onClick();
          localText2.textContent = '';
          localText.value = '';
          return false;
      }
      joinTrigger.blur();
      copyTrigger.blur();
      saveTrigger.blur();
      leaveTrigger.blur();
    };
  }

  peer.on('error', console.error);  

})();