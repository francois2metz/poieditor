# POIEditor

This is a POI Editor for [OpenStreetMap][osm] dedicated to bicycle shops (for now).

It displays the shops on a map, and a click on it display a sidebar.

## Usage

You need to have docker and docker-compose.

Copy `.env.template` to `.env`:

    cp .env{.template,}

Edit the .env and fill the required key ([jawg][] access token and the [OpenStreetMap oauth application][osm-oauth].

To start the import:

    ./script/import

To run updates:

    ./script/update

To run the frontend and the tiles:

    docker-compose up -d pg_tileserv front nginx

## License

GNU APGL v3

[jawg]: https://www.jawg.io/
[osm]: https://openstreetmap.org/
[osm-oauth]: https://www.openstreetmap.org/user/test/oauth_clients/new
