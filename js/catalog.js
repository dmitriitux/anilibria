var needUpdate = 0;

function xPagination(a){
	$("#xpagination").pagination({
		items: a,
		itemsOnPage: 12,
		cssStyle: 'light-theme',
		onPageClick: function(page){
			getCatalog(page);
			$('html, body').animate({scrollTop: $(".content").offset().top }, 0);
		}
	});
}

$("#switcher").change(function(){
    getCatalog(1, true);
});
  
function getCatalog(page, update = false){
	if($("#switcher").prop("checked")){
		var sort = 1;
	}else{
		var sort = 2;
	}
	year = '';
	genre = '';
	xpage = 'favorites';
	if(location.pathname.substring(1) != 'pages/favorites.php' && location.pathname.substring(1) != 'pages/new.php'){
		year = $.trim($('#catalogYear').val().toString().replace(/,/g, ","));
		genre = $.trim($('#catalogGenre').val().toString().replace(/,/g, ","));
		xpage = 'catalog';
	}
	search = {year, genre};
	$.post("//"+document.domain+"/public/catalog.php", { 'page': page, 'search': JSON.stringify(search), 'xpage': xpage, 'sort': sort }, function(json){
		data = JSON.parse(json);
		if(data.err == 'ok'){
			$('.simpleCatalog tbody').html(data.table);
			if(needUpdate != data.update || update){
				xPagination(data.total);
				needUpdate = data.update;
			}
		}
	});
}

$(document).ready(function() {
	getCatalog(1);
});

$(document).on('click', '[data-catalog-update]', function(e){
	$(this).blur();
	e.preventDefault();	
	getCatalog(1, true);
});
