(function () {

    'use strict';

    angular.module('app.spotify', []);

    angular
        .module("app.spotify")
        .factory("Spotify", Spotify);

    Spotify.$inject = ['APIService', 'Artist', 'Album'];

    function Spotify(APIService, Artist, Album) {

        return {
            searchArtists: function (query) {
                return APIService.get("https://api.spotify.com/v1/search?q="+query+"&type=artist")
                    .then(Artist.buildFromApi);
            },
            searchAlbums: function (query) {
                return APIService.get("https://api.spotify.com/v1/search?q="+query+"&type=album")
                    .then(Album.buildFromApi);
            }
        };

    }

    angular
        .module('app.spotify')
        .factory('APIService', APIService);

    APIService.$inject = ['$http', '$q'];

    function APIService($http, $q) {

        return{
            get: function(endpoint){
                var defer = $q.defer();
                $http({
                    method: 'GET',
                    url: endpoint,
                }).then(function(response){
                    defer.resolve(response.data);
                }).catch(function(error){
                    defer.reject(error);
                });
                return defer.promise;
            }
        }

    }


    angular
        .module('app.spotify')
        .factory('Album', Album);

    function Album() {

        /**
         * Constructor, with class name
         */
        function Album(id, name, genres, images, thumbnail, openInSpotify) {
            this.id = id;
            this.name = name;
            this.genres = genres;
            this.images = images;
            this.thumbnail = thumbnail;
            this.openInSpotify = openInSpotify;
        }

        Album.build = function (album) {
            album.images.sort(
                function(a,b) {
                    if (a.width < b.width)
                        return -1;
                    if (a.width > b.width)
                        return 1;
                    return 0;
                }
            );
            var thumbnail = album.images.length > 0 ? album.images[0].url : '';
            return new Album(
                album.id,
                album.name,
                album.genres,
                album.images,
                thumbnail,
                album.external_urls.spotify
            );
        };

        Album.buildFromApi = function (data) {
            if (angular.isArray(data.albums.items)) {
                return data.albums.items
                    .map(Album.build)
                    .filter(Boolean);
            }
            return Album.build(data.albums.items);
        };

        /**
         * Return the constructor function
         */
        return Album;

    }


    angular
        .module('app.spotify')
        .factory('Artist', Artist);

    function Artist() {

        /**
         * Constructor, with class name
         */
        function Artist(id, name, genres, images, thumbnail, openInSpotify) {
            this.id = id;
            this.name = name;
            this.genres = genres;
            this.images = images;
            this.thumbnail = thumbnail;
            this.openInSpotify = openInSpotify;
        }

        Artist.build = function (artist) {
            artist.images.sort(
                function(a,b) {
                    if (a.width < b.width)
                        return -1;
                    if (a.width > b.width)
                        return 1;
                    return 0;
                }
            );
            var thumbnail = artist.images.length > 0 ? artist.images[0].url : '';
            return new Artist(
                artist.id,
                artist.name,
                artist.genres,
                artist.images,
                thumbnail,
                artist.external_urls.spotify
            );
        };

        Artist.buildFromApi = function (data) {
            if (angular.isArray(data.artists.items)) {
                return data.artists.items
                    .map(Artist.build)
                    .filter(Boolean);
            }
            return Artist.build(data.artists.items);
        };

        /**
         * Return the constructor function
         */
        return Artist;

    }

})();