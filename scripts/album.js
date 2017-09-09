var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
 };

 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };

 /*var albumKing = {
     title: 'The Thrillers',
     artist: 'Stephen King',
     label: 'Scary Stuff',
     year: '1990',
     albumArtUrl: 'assets/images/album_covers/19.png',
     songs: [
         { title: 'Carrie', duration: '4:11' },
         { title: 'It', duration: '5:05' },
         { title: 'The Shining', duration: '1:21'},
         { title: 'Misery', duration: '9:54' },
         { title: 'The Stand', duration: '2:42'}
     ]
 };*/

 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     return $(template);
 };
 //var albumImage = document.getElementsByClassName('album-cover-art')[0];
 var setCurrentAlbum = function(album) {
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
var findParentByCLassName = function(element, chosenClass) {
  //added if (element){} as well as && theParent.className !== null after checking work
  if (element) {
     var theParent = element.parentElement;
      while (theParent.className !== chosenClass && theParent.className !== null) {
         theParent = theParent.parentElement;
   }
   return theParent;
  }
};

var getSongItem = function(element) {
   //var switchClass = element.className;
   switch (element.className) {
     case 'song-item-number':
         return element;
     case 'album-view-song-item':
         return element.querySelector('.song-item-number');
     case 'song-item-title':
     case 'song-item-duration':
          return findParentByCLassName(element, 'album-view-song-item').querySelector('.song-item-number');
         //added after checking my work with the solution
     case 'album-song-button':
     case 'ion-play':
     case 'ion-pause':
          return findParentByCLassName(element, 'song-item-number');
     default :
          return;
   }
};
var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement);

    if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
       } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
           songItem.innerHTML = playButtonTemplate;
           currentlyPlayingSong = null;
       } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
           var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
           currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
           songItem.innerHTML = pauseButtonTemplate;
           currentlyPlayingSong = songItem.getAttribute('data-song-number');
       }
 };

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;

 window.onload = function() {
     setCurrentAlbum(albumPicasso);
     songListContainer.addEventListener('mouseover', function(event) {
       if (event.target.parentElement.className === 'album-view-song-item') {
             //nailed this one
             var songItem = getSongItem(event.target);
             if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
               songItem.innerHTML = playButtonTemplate;
             }
         }
     });
     for (var i = 0; i < songRows.length; i++) {
             songRows[i].addEventListener('mouseleave', function(event) {
               var songItem = getSongItem(event.target);
               var songItemNumber = songItem.getAttribute('data-song-number');
               if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
             }
            });
              songRows[i].addEventListener('click', function(event) {
              clickHandler(event.target);
         });
      }
 }


 /*var albumList = [albumPicasso, albumMarconi, albumKing];
 var i = 0;
 albumImage.addEventListener("click", function(){
   setCurrentAlbum(albumList[i]);
   i++;
   if (i == albumList.length) {
     i = 0;
   }
 });*/
