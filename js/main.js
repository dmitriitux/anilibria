$(document).ready(function() {
	var recaptcha1;
	var recaptcha2;
	var CaptchaCallback1 = function() { recaptcha1 = grecaptcha.render('RecaptchaField1', {'sitekey' : '6LfDB34UAAAAABoC-9OH2WvVylwqILVcnlrmYBQj'}); };
	var CaptchaCallback2 = function() { recaptcha2 = grecaptcha.render('RecaptchaField2', {'sitekey' : '6LfDB34UAAAAABoC-9OH2WvVylwqILVcnlrmYBQj'}); };
	if(window.location.hash.substr(1) == 'rules'){
		$('html, body').animate({
			scrollTop: $("#rules").offset().top
		}, 500);
	}
	if(typeof player === 'undefined' && $('div#moonPlayer iframe').length == 0){
		$('#buttonAni').hide();
		$('#buttonMoon').hide();
	}else{
		tabSwitch('anilibriaPlayer');
		if($('div#moonPlayer iframe').length > 0){
			$('#buttonMoon').show();
			if(typeof player === 'undefined'){
				tabSwitch('moonPlayer');
				$('#buttonAni').hide();
			}
		}
	}
});

$(document).on("click", "[data-submit-login]", function(e) {
	$(this).blur();
	e.preventDefault();
	mail = $('input[id=newMail]').val();
	passwd = $('input[id=newPasswd]').val();
	fa2code = $('input[id=fa2code]').val();
	$.post("//"+document.domain+"/public/login.php", { 'mail': mail, 'passwd': passwd, 'fa2code': fa2code }, function(json){
		data = JSON.parse(json);
		if(data.err == 'ok'){
			document.location.href="/";
		}else{
			$("#loginMes").html("(<font color=red>"+data.mes+"</font>)");
		}
	});
});

$(document).on("click", "[data-submit-register]", function(e) {
	$(this).blur();
	e.preventDefault();
	var submit = $(this);
	var mail = $('input[id=regEmail]').val();
	var login = $('input[id=regLogin]').val();
	submit.hide(); // recaptchav3 has some delay
	if($("div#RecaptchaField1").css('display') == 'none'){
		grecaptcha.execute('6LfA2mUUAAAAAAbcTyBWyTXV2Kp6vi247GywQF1A').then(function(token) {
			$.post("//"+document.domain+"/public/registration.php", { 'login': login, 'mail': mail, 'g-recaptcha-response': token }, function(json){
				data = JSON.parse(json);
				color = 'green';
				if(data.err != 'ok'){
					color = 'red';
					if(data.mes == 'reCaptcha test failed: score too low'){
						$("div#RecaptchaField1").show();
						$.getScript("https://www.google.com/recaptcha/api.js?onload=CaptchaCallback1&render=explicit");
					}
					submit.show();
				}
				$("#regMes").html("(<font color="+color+">"+data.mes+"</font>)");
			});
		});
	}else{
		$.post("//"+document.domain+"/public/registration.php", { 'login': login, 'mail': mail, 'g-recaptcha-response': grecaptcha.getResponse(recaptcha1), 'recaptcha': 2 }, function(json){
			console.log(json);
			data = JSON.parse(json);
			color = 'green';
			if(data.err == 'ok'){
				$("div#RecaptchaField1").hide();
			}
			if(data.err != 'ok'){
				color = 'red';
				grecaptcha.reset(recaptcha1);
				submit.show();
			}
			$("#lostMes").html("(<font color="+color+">"+data.mes+"</font>)");
		});
	}
});

$(document).on("click", "[data-submit-passwdrecovery]", function(e) {
	$(this).blur();
	e.preventDefault();
	var submit = $(this);
	var mail = $('input[id=lostEmail]').val();
	submit.hide(); // recaptchav3 has some delay
	if($("div#RecaptchaField2").css('display') == 'none'){
		grecaptcha.execute('6LfA2mUUAAAAAAbcTyBWyTXV2Kp6vi247GywQF1A').then(function(token) {
			$.post("//"+document.domain+"/public/recovery.php", { 'mail': mail, 'g-recaptcha-response': token }, function(json){
				data = JSON.parse(json);
				color = 'green';
				if(data.err != 'ok'){
					color = 'red';
					if(data.mes == 'reCaptcha test failed: score too low'){
						$("div#RecaptchaField2").show();
						$.getScript("https://www.google.com/recaptcha/api.js?onload=CaptchaCallback2&render=explicit");
					}
					submit.show();
				}
				$("#lostMes").html("(<font color="+color+">"+data.mes+"</font>)");
			});
		});
	}else{
		$.post("//"+document.domain+"/public/recovery.php", { 'mail': mail, 'g-recaptcha-response': grecaptcha.getResponse(recaptcha2), 'recaptcha': 2 }, function(json){
			data = JSON.parse(json);
			color = 'green';
			if(data.err == 'ok'){
				$("div#RecaptchaField2").hide();
			}
			if(data.err != 'ok'){
				color = 'red';
				grecaptcha.reset(recaptcha1);
				submit.show();
			}
			$("#lostMes").html("(<font color="+color+">"+data.mes+"</font>)");
		});
	}
});

$(document).on("click", "[data-2fa-generate]", function(e) {
	var _this = $(this);
	_this.blur();
	e.preventDefault();
	$.post("//"+document.domain+"/public/2fa.php", {do: 'gen'}, function(json){
		data = JSON.parse(json);
		if(data.err == 'ok'){
			_this.hide();
			$("#2fakey").html(data.mes);
		}
	});
});

$(document).on("click", "[data-2fa-start]", function(e) {
	$(this).blur();
	e.preventDefault();
	secret = $('input[id=2fa]').val();
	check = $('input[id=2facheck]').val();
	passwd = $('input[id=2fapasswd]').val();
	$.post("//"+document.domain+"/public/2fa.php", {do: 'save', '2fa': secret, code: check, passwd: passwd}, function(json){
		data = JSON.parse(json);
		color = 'red';
		if(data.err == 'ok'){
			color = 'green';
			if(data.key == '2FAenabled'){
				$("#send2fa").val('Выключить 2FA');
				$("div#2fagen").hide();
			}else{
				$("#send2fa").val('Включить 2FA');
				$("div#2fagen").show();
			}
			$("#2facheck").val('');
			$("#2fapasswd").val('');
		}
					
		$("#2faMes").html("(<font color="+color+">"+data.mes+"</font>)");
	});
});


$(document).on("click", "[data-change-email]", function(e) {
	$(this).blur();
	e.preventDefault();
	mail = $('input[id=changeEmail]').val();
	passwd = $('input[id=changeEmailPasswd]').val();
	$.post("//"+document.domain+"/public/change/mail.php", {'mail': mail, 'passwd': passwd }, function(json){
		data = JSON.parse(json);
		color = 'red';
		if(data.err == 'ok'){
			color = 'green';
		}
		$("#changeEmailMes").html("(<font color="+color+">"+data.mes+"</font>)");
	});
});


$(document).on("click", "[data-change-passwd]", function(e) {
	$(this).blur();
	e.preventDefault();
	passwd = $('input[id=changePasswd]').val();
	$.post("//"+document.domain+"/public/change/passwd.php", {'passwd': passwd }, function(json){
		data = JSON.parse(json);
		color = 'red';
		if(data.err == 'ok'){
			color = 'green';
		}
		$("#changePasswdMes").html("(<font color="+color+">"+data.mes+"</font>)");
	});
});


$(document).on("click", "[data-edit-profile]", function(e) {
	$(this).blur();
	e.preventDefault();
	$('#editProfile').modal('show');
});

$(document).on("click", "[data-reset-user-values]", function(e) {
	$(this).blur();
	e.preventDefault();
	$.post("//"+document.domain+"/public/save.php", {'reset': 1 }, function(json){
		data = JSON.parse(json);
		if(data.err == 'ok'){
			text = 'Не указано';
			$("#name").text(text);
			$("#age").text(text);
			$("#sex").text(text);
			$("#vk").text(text);
			$("#telegram").text(text);
			$("#steam").text(text);
			$("#phone").text(text);
			$("#skype").text(text);
			$("#facebook").text(text);
			$("#instagram").text(text);
			$("#youtube").text(text);
			$("#twitch").text(text);
			$("#twitter").text(text);
			$('#editProfile').modal('hide');
			return;
		}
		$("#profileInfo").html('Редактировать профиль (<font color=red>'+data.mes+'</font>)');
	});
});

$(document).on("click", "[data-save-user-values]", function(e) {
	$(this).blur();
	e.preventDefault();
	var name = $('input[id=name]').val();
	var age = $('input[id=age]').val();
	var sex = $('select[id=sex]').val();
	var vk = $('input[id=vk]').val();
	var telegram = $('input[id=telegram]').val();
	var steam = $('input[id=steam]').val();
	var phone = $('input[id=phone]').val();
	var skype = $('input[id=skype]').val();
	var facebook = $('input[id=facebook]').val();
	var instagram = $('input[id=instagram]').val();
	var youtube = $('input[id=youtube]').val();
	var twitch = $('input[id=twitch]').val();
	var twitter = $('input[id=twitter]').val();
	$.post("//"+document.domain+"/public/save.php", {'name': name, 'age': age, 'sex': sex, 'vk': vk, 'telegram': telegram, 'steam': steam, 'phone': phone, 'skype': skype, 'facebook': facebook, 'instagram': instagram, 'youtube': youtube, 'twitch': twitch, 'twitter': twitter }, function(json){
		data = JSON.parse(json);
		if(data.err == 'ok'){
			if(name != "") $("#name").text(name);
			if(age != "") $("#age").text(age);
			if(sex != ""){
				if(sex=="1"){
					$("#sex").text("Мужской");
				}
				if(sex=="2"){
					$("#sex").text("Женский");
				}	
			}
			if(vk != "") $("#vk").text(vk);
			if(telegram != "") $("#telegram").text(telegram);
			if(steam != "") $("#steam").text(steam);
			if(phone != "") $("#phone").text(phone);
			if(skype != "") $("#skype").text(skype);
			if(facebook != "") $("#facebook").text(facebook);
			if(instagram != "") $("#instagram").text(instagram);
			if(youtube != "") $("#youtube").text(youtube);
			if(twitch != "") $("#twitch").text(twitch);
			if(twitter != "") $("#twitter").text(twitter);
			$('#editProfile').modal('hide');
			return;
		}
		$("#profileInfo").html('Редактировать профиль (<font color=red>'+data.mes+'</font>)');
	});
});

$(document).on('click', '[data-tab]', function(e){
	$(this).blur();
	e.preventDefault();	
	tabSwitch($(this).data('tab'));
});

function tabSwitch(tab){
	$('[data-tab]').removeClass('active');
	$("[data-tab="+tab+"]").addClass('active');
	
	$('.xplayer').hide();
	$('#'+tab).show();
}

$(document).on('click', '[data-light]', function(e){
	$(this).blur();
	e.preventDefault();

	if ($('.light-off').length > 0 ){
		if($('.light-off').is(":hidden")){
			$('.light-off').show();
			$(".light-off").fadeTo(500, 1);
			$(".xdark").css("background","#29003A");
		}else{
			if($('.light-off').css('opacity') != 1){
				return;
			}
			$(".light-off").fadeTo(500, 0, function(){ $('.light-off').hide(); });
			$(".xdark").css("background","transparent");
		}
	}
});

$(document).on('click', '[data-online-table]', function(e){
	$(this).blur();
	e.preventDefault();	
	$('#statModal').modal('show');
});

$(document).on('click', '[data-change-announce]', function(e){
	$(this).blur();
	e.preventDefault();
	if($(this).data("change-announce") == 1){
		$('#changeAnnounce').modal('show');
	}
});

$(document).on('click', '[data-send-announce]', function(e){
	$(this).blur();
	e.preventDefault();
	id = $('input[id=releaseID]').val();
	var announce = $('input[id=announce]').val();
	$.post("//"+document.domain+"/public/release/announce.php", {'id': id, 'announce': announce }, function(json){
		data = JSON.parse(json);
		if(data.err != 'ok'){
			$("#changeAnnounceMes").html('Изменить анонс (<font color=red>'+data.mes+'</font>)');
			return;
		}
		location.reload();
	});
});

$(document).on('click', '[data-torrent-edit]', function(e){
	$(this).blur();
	e.preventDefault();
	$('#editTorrent').modal('show');
});

$('#uploadTorrent').change(function(e) {
	if(this.files[0] !== undefined){
		$('#torrentFile').val(this.files[0].name);
	}
});

$(document).on('click', '[data-send-torrent]', function(e){
	$(this).blur();
	e.preventDefault();
	var sendData = [];
	form_data = new FormData();
	// {do: "add" ,fid: "17", rid: "7", quality: "HDTVRip 720p", series: "1-8", ctime: "11.10.2018"}
	$('#editTorrentTable tr').each(function (i, row){ // get data from table
		sendData[i] = {
			'do': 'change',
			fid: $(row).find('input[id^="torrentEditTableID"]').val(),
			rid: $('input[id=releaseID]').val(),
			quality: $(row).find('input[id^="torrentEditTableQuality"]').val(),
			series: $(row).find('input[id^="torrentEditTableSeries"]').val(),
			ctime: $(row).find('input[id^="torrentEditTableDate"]').val(),
			'delete': $(row).find('input[id^="torrentEditTableDelete"]').val(),
		};
	});
	$.each(sendData, function(i){
		$("#torrentTableInfo"+sendData[i]['fid']).html("Серия "+sendData[i]['series']+" ["+sendData[i]['quality']+"]");
		$("#torrentTableDate"+sendData[i]['fid']).html("Добавлен "+sendData[i]['ctime']);
		if(sendData[i]['delete'].length > 0){
			$('table tr#torrentTableID'+sendData[i]['fid']).remove();
			$('table tr#torrentEditTable'+sendData[i]['fid']).remove();
		}
	});
	if(document.getElementById("uploadTorrent").files.length > 0){ // prepare file upload
		sendData.push({ 
			'do': 'add', 
			fid: $('input[id=torrentFileUpdateID]').val(), 
			rid: $('input[id=releaseID]').val(), 
			quality: $('input[id=torrentFileSeriesQuality]').val(), 
			series: $('input[id=torrentFileSeries]').val(), 
			ctime: '',
		});
		form_data.append('torrent', $('#uploadTorrent').prop('files')[0]);
	}
	form_data.append('data', JSON.stringify(sendData));
	$.ajax({
		type: 'POST',
		cache: false,
		processData: false,
		contentType: false,
		data: form_data,
		url: "//"+document.domain+"/public/torrent/index.php",
		success: function(json) {
			data = JSON.parse(json);			
			if(data.err != 'ok'){
				$("#changeAnnounceMes").html('Редактирование торрентов (<font color=red>'+data.mes+'</font>)');
				return;
			}
			$("#changeAnnounceMes").html('Редактирование торрентов (<font color=green>'+data.mes+'</font>)');
			tr = $('input[id=torrentFileUpdateID]').val();
			if(tr.length > 0){
				$('table tr#torrentTableID'+tr).remove();
				$('table tr#torrentEditTable'+tr).remove();
			}
			if(data.id !== undefined){
				$('#editTorrentTable').append('<tr id="torrentEditTable'+data.id+'"><td><input id="torrentEditTableID'+data.id+'" class="form-control" style="width: 130px;" type="text" value="'+data.id+'" readonly=""></td><td><input id="torrentEditTableSeries'+data.id+'" class="form-control" style="margin-left: 5px; width: 130px;" type="text" value="'+$('input[id=torrentFileSeries]').val()+'"></td><td><input id="torrentEditTableQuality'+data.id+'" class="form-control" style="margin-left: 5px; width: 130px;" type="text" value="'+$('input[id=torrentFileSeriesQuality]').val()+'"></td><td><input id="torrentEditTableDate'+data.id+'" class="form-control" style="margin-left: 5px; width: 258px;" type="text" value="'+data.date+'"></td><td><input id="torrentEditTableDelete'+data.id+'" class="form-control" style="margin-left: 5px; width: 130px;" type="text" placeholder="Удалить?"></td></tr>');
				$('#publicTorrentTable').append('<tr id="torrentTableID'+data.id+'"><td id="torrentTableInfo28" class="torrentcol1">Серия '+$('input[id=torrentFileSeries]').val()+' ['+$('input[id=torrentFileSeriesQuality]').val()+']</td><td class="torrentcol2"><img style="margin-bottom: 3px;" src="/img/other/1.png" alt="dl"> '+data.size+' <img style="margin-bottom: 3px;" src="/img/other/2.png" alt="dl"> 0 <img style="margin-bottom: 3px;" src="/img/other/3.png" alt="dl"> 0 <img style="margin-bottom: 3px;" src="/img/other/4.png" alt="dl"> 0</td><td id="torrentTableDate'+data.id+'" class="torrentcol3">Добавлен '+data.date+'</td><td class="torrentcol4"><img style="margin-bottom: 3px;" src="/img/other/5.png" alt="dl"> <a class="torrent-download-link" href="/public/torrent/download.php?id='+data.id+'">Cкачать</a></td></tr>');
			}
		}
	});
});

$(document).on('click', '[data-release-delete]', function(e){
	$(this).blur();
	e.preventDefault();
	if(window.confirm('Действительно хотите удалить релиз?')){
		$.post("//"+document.domain+"/public/release/delete.php", {'id': $('input[id=releaseID]').val()}, function(json){
		data = JSON.parse(json);
		if(data.err == 'ok'){
			window.location.replace('/pages/new.php');
		}else{
			console.log(data.mes);
		}
	});
	}
});

$('#uploadPosterAdmin').change(function(e) {
	if(this.files[0] !== undefined){
		var reader = new FileReader();
		reader.onload = function(e) {
			$('#adminPoster').attr('src', e.target.result);
		}
		reader.readAsDataURL(this.files[0]);		
	}
});

$(document).on('click', '[data-release-new], [data-release-update]', function(e){
	$(this).blur();
	e.preventDefault();
	form_data = new FormData();
	var _this = $(this);
	var sendData = {
		'name': $('input[id=nName]').val(),
		'ename': $('input[id=nEname]').val(),
		'aname': $('input[id=nAname]').val(),
		'year': $('input[id=nYear]').val(),
		'type': $('input[id=nType]').val(),
		'genre': $.trim($('.chosen').val().toString().replace(/,/g, ", ")),
		'voice': $('input[id=nVoice]').val(),
		
		'translator': $('input[id=nTranslator]').val(),
		'editing': $('input[id=nEditing]').val(),
		'decor': $('input[id=nDecor]').val(),
		'timing': $('input[id=nTiming]').val(),
		
		'block': $('input[id=nBlock]').val(),
		
		'announce': $('input[id=nAnnounce]').val(),
		'status': $('select[id=nStatus]').val(),
		'day': $('select[id=nDay]').val(),
		'moonplayer': $('input[id=nMoon]').val(),
		'description': $('textarea[id=nDescription]').val(),
	};
	if($(this).data('release-update') !== undefined){
		sendData = $.extend(sendData, {'update': $('input[id=releaseID]').val()}); 
	}
	if(document.getElementById("uploadPosterAdmin").files.length > 0){ // prepare file upload
		form_data.append('poster', $('#uploadPosterAdmin').prop('files')[0]);
	}
	form_data.append('data', JSON.stringify(sendData));
	console.log(JSON.stringify(sendData));
	$.ajax({
		type: 'POST',
		cache: false,
		processData: false,
		contentType: false,
		data: form_data,
		url: "//"+document.domain+"/public/release/index.php",
		success: function(json) {
			//console.log(json);
			data = JSON.parse(json);
			//if(_this.data('release-update') !== undefined){
				window.location=data.url;
			//}
			//if(_this.data('release-new') !== undefined){
			//	$('#tableRelease').DataTable().ajax.reload(null, false);
			//}
		}
	});
});

$(document).on('click', '[data-xrelease-edit]', function(e){
	$(this).blur();
	e.preventDefault();
	if($('div#xreleaseEdit').is(':hidden')){
		$('div#xreleaseInfo').hide();
		$('div#emptyHeader').hide();
		$('div#xreleaseEdit').show();
		$('div#editHeader').show();
		$('div#xreleaseDesc').show();
		$(".chosen").val(chosenGenre).trigger("chosen:updated.chosen");
		
	}else{
		$('div#xreleaseEdit').hide();
		$('div#editHeader').hide();
		$('div#xreleaseDesc').hide();
		$('div#xreleaseInfo').show();
		$('div#emptyHeader').show();
	}
});

$("#smallSearchInput").focus(function() {
	$('#smallSearch').show();
});

$("#smallSearchInput").focusout(function(){
	setTimeout(function(){$('#smallSearch').hide();},250);
});

$("#smallSearchInput").keyup(function(){	
	if($('input[id=smallSearchInput]').val().length > 2){
		$.post("//"+document.domain+"/public/search.php", {'search': $('input[id=smallSearchInput]').val(), 'small': '1'}, function(json){
			if(json){
				data = JSON.parse(json);
				if(data.err == 'ok'){
					$("#smallSearchTable tr").remove();
					$('#smallSearchTable').append(data.mes);
				}
			}
		});
	}
});

$(document).on('click', '[data-release-favorites]', function(e){
	var _this = $(this);
	$.post("//"+document.domain+"/public/favorites.php", {'rid': $('input[id=releaseID]').val()}, function(json){
		console.log(json);
		data = JSON.parse(json);
		if(data.err == 'ok'){
			if(_this.hasClass("favorites")){
				_this.removeClass("favorites");
			}else{
				_this.addClass("favorites");
			}
		}
	});
});

$(document).on('click', '[data-release-last]', function(e){
	var _this = $(this);
	$.post("//"+document.domain+"/public/release/last.php", {'id': $('input[id=releaseID]').val()}, function(json){
		data = JSON.parse(json);
		if(data.err == 'ok'){
			location.reload();
		}
	});
});

$('#rPosition').on('change', function() {
	var selectRequest = this.value;
	var listRequest = {
		1: {
			1: 'techTask',
		},
		2: {
			1: 'voiceAge',
			2: 'voiceEquip',
			3: 'voiceExample',
			4: 'voiceTiming',
		},
		3: {
			1: 'subExp',
			2: 'subPosition',
		}
	}
	for(key in listRequest){
		for(k in listRequest[key]){
			$('#'+listRequest[key][k]).hide();
			$('#'+listRequest[key][k]).val(''); // clean
		}
	}
	if(selectRequest in listRequest){
		for(key in listRequest[selectRequest]){
			$('#'+listRequest[selectRequest][key]).show();
		}
	}
});

$('#rAccept').on('change', function() {
	$("#rAccept").attr("disabled", true);
	$('#sendRequest').show();
});

$(document).on('click', '[data-send-request]', function(e){
	if($('select[id=rPosition]').val() === null){
		return;
	}
	var fields = {
		"rPosition": $('select[id=rPosition]').val(),
		"rName": $('input[id=rName]').val(),
		"rNickname": $('input[id=rNickname]').val(),
		"rAge": $('input[id=rAge]').val(),
		"rCity": $('input[id=rCity]').val(),
		"rEmail": $('input[id=rEmail]').val(),
		"rTelegram": $('input[id=rTelegram]').val(),
		"rAbout": $('textarea[id=rAbout]').val(),
		"rWhy": $('textarea[id=rWhy]').val(),
		"rWhere": $('textarea[id=rWhere]').val(),
		"techTask": $('input[id=techTask]').val(),
		"voiceAge": $('input[id=voiceAge]').val(),
		"voiceEquip": $('input[id=voiceEquip]').val(),
		"voiceExample": $('input[id=voiceExample]').val(),
		"voiceTiming": $('input[id=voiceTiming]').val(),
		"subExp": $('input[id=subExp]').val(),
		"subPosition": $('input[id=subPosition]').val(),	
	}
	$.post("//"+document.domain+"/public/hh.php", {'info': JSON.stringify(fields)}, function(json){
		if(json){
			data = JSON.parse(json);
			if(data.err == 'ok'){
				$('#requestModal').modal('show');
			}else{
				$("#sendHHMes").html('Пожалуйста, заполните (<font color=red>'+data.mes+'</font>)');
			}
		}
	});
});

$(document).on('click', '[data-show-other]', function(e){
	$(this).blur();
	e.preventDefault();
	$('#otherModal').modal('show');
});
