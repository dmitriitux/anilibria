<?php 

$data = [
	"torrentUpdate" => 0,
	"id" => "0",
	"code" => "obnovis",
	"title" => "Приложение устраело, необходимо обновить, только маленьким шрифтом / Приложение устраело, необходимо обновить",
	"torrent_link" => "",
	"link" => "",
	"image" => "/upload/app/old_api_r.jpg",
	"episode" => "Это важно",
	"description" => "Нажмите на уведомление об обновлении и установите новую версию приложения. Сайт обновлён, это приложение не совместимо с новой версией сайта. <a href='https://www.anilibria.tv/upload/app/AniLibria_v2.3.0.apk'>или нажми на эту ссылку, чтобы скачать файл</a>",
	"season" => [
		"Зима 2019"
	],
	"voices" => [
		"RadiationX"
	],
	"genres" => [
		"постапокалипсис",
		"ужасы",
		"триллер"
	],
	"types" => [
		"Привет от разработчиков"
	],
	"release_status" => "Обманочка, это не релиз",
	"sessId" => NULL,
	"isBlocked" => FALSE,
	"contentBlocked" => NULL,
	"mp4" => [],
	"Uppod" => [],
	"Moonwalk" => NULL,
	"torrentList" => [],
	"showDonateDialog" => FALSE,
	"fav" => [
		"id" => 0,
		"count" => 99,
		"isFaved" => TRUE,
		"sessId" => "",
		"skey" => "",
		"isGuest" => FALSE
	]
];

die(json_encode($data));