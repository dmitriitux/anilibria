<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/private/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/private/init/mysql.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/private/init/memcache.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/private/init/session.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/private/init/var.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/private/func.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/private/auth.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/private/minify.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/private/header.php');

$var['page'] = 'release';
$var['release'] = ['id' => 508, 'name' => 'super test'];

/*	TODO
	Page generated in 0.3303 seconds. Peak memory usage: 1.06 MB
	file_get_contents use 97.98% time in func getReleaseVideo and wsInfoShow
	we need cache data from remote servers 
	https://img.poiuty.com/img/ae/293fcc66d6b2dcf71f4bf578f74d27ae.png
*/
?>

<div class="light-off"></div>

<?php echo showRelease(); ?>

<div class="modal fade" id="statModal" tabindex="-1" role="dialog" aria-hidden="true" >
	<div class="modal-dialog" style="width: 480px;">
		<div class="modal-content">
			<div class="modal-header">
				<center><h4 class="modal-title">ТОП-20 ПРЯМО СЕЙЧАС</h4></center>
			</div>
			<div  class="modal-body">
				<div class="tableStat">
					<table class="table table-borderless table-condensed table-hover">
						<tr>
							<th>ТАЙТЛ</th>
							<th class="tableCenter">ОНЛАЙН</th>
						</tr>
						<?php echo wsInfoShow(); ?>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>

<?require_once($_SERVER['DOCUMENT_ROOT'].'/private/footer.php');?>