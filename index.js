'use strict';

var sopa = [];
var pos = 0;
var dif = 0;
var segundos = 0;
var mins = 0;
var secs = 0;
var nombre = '';
var palabra = '';
var correctas = [];
var resueltas = [];

/**
 * Adds commas to a number
 * @param {number} number
 * @param {string} locale
 * @return {string}
 */
module.exports = function() {
    return true;
};

module.exports.init = function() {
	$.ajax({
		url: 'http://localhost/server-sopa/f.php',
		data: {action: 'cargarSopa', dificultad: $('#dificultad').val(), nombre: $('#nombre').val()},
		method: 'POST',
		success: function(e) {
			var r = JSON.parse(e);
			
			dif  = $('#dificultad').val();
			nombre = $('#nombre').val();
			sopa = r['sopa']['matriz'];
			correctas = r['sopa']['correctas'];
			
			for (var i = 0; i < dif; i++) {
				$('#sopa').find('tbody').append('<tr>');

				for (var j = 0; j < dif; j++) {
					$('#sopa').find('tbody').append('<td class="sw ' + ((i*dif)+j) + '">' + sopa[(i*dif)+j] + '</td>');
				}	

				$('#sopa').find('tbody').append('</tr>');
			}
			
			for (var i = 0; i < correctas.length; i++) {
				$('#correctas').find('tbody').append('<tr><td>' + correctas[i] + '</td><tr>');
			}
			
			if (r['partida']['resueltas']) {
				for (var j=0; j < r['partida']['resueltas'].length; j++) {
					cargar_palabra(r['partida']['resueltas'][j]);
				}
			}
			
			if (r['partida']['segundos']) segundos = r['partida']['segundos'];
		}
	});	
	
	$(document).on('click', '.sw', function(){
		$(this).addClass('selected');
		palabra += $(this).text();
	});
	
	$('#verificar').click(function(){
		verificar_palabra(palabra);
	});
	
	$('#resolver').click(function(){
		for (var j=0; j < correctas.length; j++) {
			cargar_palabra(correctas[j]);
		}
	});
	
	$('#guardar').click(function(){
		$.ajax({
			url: 'http://localhost/server-sopa/f.php',
			data: {action: 'guardarSopa', sopa: $('#dificultad').val(), nombre: $('#nombre').val(), resueltas: resueltas, segundos: segundos},
			method: 'POST',
			success: function() {
				alert('La sopa fue guardada exitosamente.');
				window.location.reload();
			}
		});	
	});
	
	setInterval(function() {
		segundos++;
		mins = Math.floor(segundos / 60);
		secs = segundos % 60;
		$('#segundos').html(mins+':'+secs);
	}, 1000);
	
	$('#configuracion').fadeOut();
	$('#juego').fadeIn();
}

function cargar_palabra(pal) {
	var tmp = 0;
	
	//Buscar de izquierda a derecha
	for (var i = 0; i < dif; i++) {
		pos = 0;
		tmp = 0;

		for (var j = 0; j < dif; j++) {
			if (pal.charAt(tmp) == $('.' + ((i*dif)+j)).text()) {
				tmp++;
				$('.'+((i*dif)+j)).addClass('tmp');
			} else {
				tmp = 0;
				$('.tmp').each(function() {
					$(this).removeClass('tmp');		
				});
			}

			if (tmp == pal.length) verificar_palabra(pal);
		}	
	}

	//Buscar de derecha a izquierda
	for (var i = 0; i <= dif; i++) {
		pos = 0;
		tmp = 0;

		for (var j = ((dif*i) + (dif-1)); j >= (dif*i); j--) {
			//console.log($('.' + ((i*dif) - j)).text());
			if (pal.charAt(tmp) == $('.' + j).text()) {
				tmp++;
				$('.'+j).addClass('tmp');
			} else {
				tmp = 0;
				$('.tmp').each(function(){
					$(this).removeClass('tmp');	
				});
			}

			if (tmp == pal.length) verificar_palabra(pal);
		}	
	}

	//Buscar de arriba a abajo
	for (var i = 0; i <= dif; i++) {
		pos = 0;
		tmp = 0;

		for (var j = 0; j < dif; j++) {
			//console.log($('.' + (i+(j*dif))).text());
			if (pal.charAt(tmp) == $('.' + (i+(j*dif))).text()) {
				tmp++;
				$('.'+(i+(j*dif))).addClass('tmp');
			} else {
				tmp = 0;
				$('.tmp').each(function(){
					$(this).removeClass('tmp');	
				});
			}

			if (tmp == pal.length) verificar_palabra(pal);
		}	
	}

	//Buscar de abajo a arriba
	for (var i = 0; i <= dif; i++) {
		pos = 0;
		tmp = 0;

		for (var j = (dif-1); j >= 0; j--) {
			//console.log($('.' + (i+(j*dif))).text());
			if (pal.charAt(tmp) == $('.' + (i+(j*dif))).text()) {
				tmp++;
				$('.'+(i+(j*dif))).addClass('tmp');
			} else {
				tmp = 0;
				$('.tmp').each(function(){
					$(this).removeClass('tmp');	
				});
			}

			if (tmp == pal.length) verificar_palabra(pal);
		}	
	}
}

function verificar_palabra(pal) {
	if (correctas.indexOf(pal) >= 0 && resueltas.indexOf(pal) < 0) { 
		resueltas.push(pal); 
		
		$('.selected').each(function() {
			$(this).removeClass('selected').addClass('done');				
		});

		$('.tmp').each(function() {
			$(this).removeClass('tmp').addClass('done');		
		});
	}

	$('td').removeClass('selected');
	palabra = '';
}
