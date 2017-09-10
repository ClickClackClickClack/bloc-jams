var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     var $row = $(template);
     var clickHandler = function() {
         var $songNumber = parseInt($(this).attr('data-song-number'));
         var $current = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
         if(currentlyPlayingSongNumber !== null){
           $current.html(currentlyPlayingSongNumber);
         }
         if(currentlyPlayingSongNumber !== $songNumber){
           $(this).html(pauseButtonTemplate);
           currentlyPlayingSongNumber = $songNumber;
           currentSongFromAlbum = currentAlbum.songs[$songNumber - 1];
           updatePlayerBarSong();
         }
         else if(currentlyPlayingSongNumber === $songNumber){
           $(this).html(playButtonTemplate);
           $('.main-controls .play-pause').html(playerBarPlayButton);
           currentlyPlayingSongNumber = null;
           currentSongFromAlbum = null;
         }
     };

     var onHover = function(event) {
         var numHolder = $(this).find('.song-item-number');
         var songNum = parseInt(numHolder.attr('data-song-number'));
         if(songNum !== currentlyPlayingSongNumber){
           numHolder.html(playButtonTemplate);
         }
     };
     var offHover = function(event) {
         var numHolder = $(this).find('.song-item-number');
         var songNum = parseInt(numHolder.attr('data-song-number'));
         if(songNum !== currentlyPlayingSongNumber){
           numHolder.html(songNum);
         }
     };

     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

 var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
     $albumSongList.empty();
     for (var i = 0; i < album.songs.length; i++) {
       var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
       $albumSongList.append($newRow);
     }
};
var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');var $nextButton = $('.main-controls .next');

$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 });
var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
};
var nextSong = function(){
  var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  var prevSong = currentlyPlayingSongNumber;

  currentIndex++;
  if(currentIndex >= currentAlbum.songs.length){
    currentIndex = 0;
  }
  currentlyPlayingSongNumber = currentIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentIndex];
  updatePlayerBarSong();

  var $prevSongHolder = $('.song-item-number[data-song-number="' + prevSong + '"]');
  $prevSongHolder.html(prevSong);

  var $nextSongHolder = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  $nextSongHolder.html(pauseButtonTemplate);
};

var previousSong = function(){
  var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  var lastSong = currentlyPlayingSongNumber;

  currentIndex--;
  if(currentIndex < 0){
    currentIndex = (currentAlbum.songs.length - 1);
  }
  currentlyPlayingSongNumber = currentIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentIndex];
  updatePlayerBarSong();

  var $targetSongHolder = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  $targetSongHolder.html(pauseButtonTemplate);
  var $lastSongHolder = $('.song-item-number[data-song-number="' + lastSong + '"]');
  $lastSongHolder.html(lastSong);
  $('.play-pause').html(playerBarPauseButton);
};
