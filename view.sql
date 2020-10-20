DROP VIEW IF EXISTS poi;

CREATE VIEW poi AS
SELECT concat('node', osm_id) AS osm_id, geom::geometry(Point, 3857), name FROM osm_poi_point
UNION ALL
SELECT CASE WHEN osm_id < 0 THEN concat('relation', -osm_id) ELSE concat('way', osm_id) END AS osm_id, ST_PointOnSurface(geom)::geometry(Point, 3857) AS geom, name FROM osm_poi_polygon;
