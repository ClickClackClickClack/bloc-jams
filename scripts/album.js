var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>'
      ;

     var $row = $(template);
     var clickHandler = function() {
         var $songNumber = parseInt($(this).attr('data-song-number'));
         if(currentlyPlayingSongNumber !== null){
           var $current = getSongNumberCell(currentlyPlayingSongNumber);
           $current.html(currentlyPlayingSongNumber);
         }
         if(currentlyPlayingSongNumber !== $songNumber){
           $(this).html(pauseButtonTemplate);
           setSong($songNumber);
           currentSoundFile.play();
           updateSeekBarWhileSongPlays();
           var $thumbValue = $('.volume .thumb');
           var $fillValue = $('.volume .fill');
           $thumbValue.css({left: currentVolume + '%'});
           $fillValue.width(currentVolume + '%');
           updatePlayerBarSong();
         }
         else if(currentlyPlayingSongNumber === $songNumber){
             $(this).html(playButtonTemplate);
             $('.main-controls .play-pause').html(playerBarPlayButton);
             if(currentSoundFile.isPaused()) {
                 currentSoundFile.play();
                 updateSeekBarWhileSongPlays();
                 $(this).html(pauseButtonTemplate);
                 $('.main-controls .play-pause').html(playerBarPauseButton);
             }
             else {
                 currentSoundFile.pause();
                 $(this).html(playButtonTemplate);
                 $('.main-controls .play-pause').html(playerBarPlayButton);
              }
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

var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
          var seekBarFillRatio = this.getTime() / this.getDuration();
          var $seekBar = $('.seek-control .seek-bar');
          updateSeekPercentage($seekBar, seekBarFillRatio);
          setCurrentTimeInPlayerBar(this.getTime());
          setTotalTimeInPlayerBar(currentSoundFile.getDuration());
        });
     }
 };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };
 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');

     $seekBars.click(function(event) {
       var offsetX = event.pageX - $(this).offset().left;
       var barWidth = $(this).width();
       var seekBarFillRatio = offsetX / barWidth;
       if($(this).parent().attr('class') == 'seek-control'){

         seek(seekBarFillRatio * currentSoundFile.getDuration());
       }
       else{
         setVolume(seekBarFillRatio * 100);
       }
       updateSeekPercentage($(this), seekBarFillRatio);
     });

     $seekBars.find('.thumb').mousedown(function(event) {
       var $seekBar = $(this).parent();
       $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             if($(this).parent().attr('class') == 'seek-control'){

               seek(seekBarFillRatio * currentSoundFile.getDuration());
             }
             else{
               setVolume(seekBarFillRatio * 100);
             }
             updateSeekPercentage($seekBar, seekBarFillRatio);
       });
       $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
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
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');
$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $playPause.click(togglePlayFromPlayerBar);
 });

 var togglePlayFromPlayerBar = function(){
   if(currentSoundFile == null){
     $playPause.html(playerBarPauseButton);
     setSong(1);
     var currentSongCell = getSongNumberCell(currentlyPlayingSongNumber);
     currentSongCell.html(pauseButtonTemplate);
     currentSoundFile.play();
   }
   else if(currentSoundFile.isPaused()){
         var currentSongCell = getSongNumberCell(currentlyPlayingSongNumber);
         currentSongCell.html(pauseButtonTemplate);
         $playPause.html(playerBarPauseButton);
         currentSoundFile.play();
     }
     else if(currentSoundFile.isPaused() !== true){
         var currentSongCell = getSongNumberCell(currentlyPlayingSongNumber);
         currentSongCell.html(playButtonTemplate);
         $playPause.html(playerBarPlayButton);
         currentSoundFile.pause();
     }
 };

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  //setTotalTimeInPlayerBar();
};

var nextSong = function(){
  var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  var prevSong = currentlyPlayingSongNumber;

  currentIndex++;
  if(currentIndex >= currentAlbum.songs.length){
    currentIndex = 0;
  }
  setSong(currentIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updatePlayerBarSong();

  var $prevSongHolder = getSongNumberCell(prevSong);
  $prevSongHolder.html(prevSong);

  var $nextSongHolder = getSongNumberCell(currentlyPlayingSongNumber);
  $nextSongHolder.html(pauseButtonTemplate);
};

var previousSong = function(){
  var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  var lastSong = currentlyPlayingSongNumber;

  currentIndex--;
  if(currentIndex < 0){
    currentIndex = (currentAlbum.songs.length - 1);
  }
  setSong((currentIndex + 1));
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updatePlayerBarSong();

  var $targetSongHolder = getSongNumberCell(currentlyPlayingSongNumber);
  $targetSongHolder.html(pauseButtonTemplate);
  var $lastSongHolder = getSongNumberCell(lastSong);
  $lastSongHolder.html(lastSong);
  $('.play-pause').html(playerBarPauseButton);
};

var setSong = function(songNumber){
     if (currentSoundFile) {
      currentSoundFile.stop();
     }
     currentlyPlayingSongNumber = parseInt(songNumber);
     currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
     currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         formats: [ 'mp3' ],
         preload: true
     });
     setVolume(currentVolume);
};

var setCurrentTimeInPlayerBar = function(currentTime){
  $('.current-time').text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime){

     $('.total-time').text(filterTimeCode(totalTime));

};

var filterTimeCode = function(timeInSeconds){
   var totalSeconds = parseFloat(timeInSeconds);
   var minutes = Math.floor(totalSeconds / 60);
   var seconds = Math.floor(totalSeconds % 60);
   if(seconds < 10){
      var finalTime = (minutes + ':0' + seconds);
   }
   else{
      var finalTime = (minutes + ':' + seconds);
   }
   return finalTime;
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};
