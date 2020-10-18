DROP VIEW IF EXISTS poi;

CREATE VIEW poi AS
SELECT osm_id, geom::geometry(Point, 3857), name FROM osm_poi_point
UNION ALL
SELECT osm_id, ST_PointOnSurface(geom)::geometry(Point, 3857) AS geom, name FROM osm_poi_polygon;
