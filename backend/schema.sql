 CREATE TABLE "user"
  (
     "uuid"     VARCHAR(255) NOT NULL,
     "email"    VARCHAR(255) NOT NULL,
     "password" VARCHAR(255) NOT NULL,
     CONSTRAINT "user_pkey" PRIMARY KEY ("uuid")
  );

CREATE TABLE "itinerary"
  (
     "uuid"        VARCHAR(255) NOT NULL,
     "title"       VARCHAR(255) NOT NULL,
     "description" VARCHAR(255) NULL,
     "user_uuid"   VARCHAR(255) NOT NULL,
     CONSTRAINT "itinerary_pkey" PRIMARY KEY ("uuid")
  );

CREATE TABLE "location"
  (
     "uuid"              VARCHAR(255) NOT NULL,
     "photo_uri"         VARCHAR(1000) NOT NULL,
     "title"             VARCHAR(255) NOT NULL,
     "description"       VARCHAR(255) NOT NULL,
     "formatted_address" VARCHAR(255) NOT NULL,
     "itinerary_uuid"    VARCHAR(255) NOT NULL,
     CONSTRAINT "location_pkey" PRIMARY KEY ("uuid")
  );

CREATE TABLE "diary_entry"
  (
     "uuid"              VARCHAR(255) NOT NULL,
     "title"             VARCHAR(255) NOT NULL,
     "description"       VARCHAR(255) NULL,
     "photo_uri"         VARCHAR(255) NULL,
     "price"             INT NOT NULL DEFAULT 0,
     "rating"            INT NOT NULL DEFAULT 0,
     "formatted_address" VARCHAR(255) NOT NULL,
     "created_at"        TIMESTAMPTZ NOT NULL,
     "journal"           VARCHAR(255) NULL,
     "user_uuid"         VARCHAR(255) NOT NULL,
     CONSTRAINT "diary_entry_pkey" PRIMARY KEY ("uuid")
  );

ALTER TABLE "itinerary"
  ADD CONSTRAINT "itinerary_user_uuid_foreign" FOREIGN KEY ("user_uuid")
  REFERENCES "user" ("uuid") ON UPDATE CASCADE;

ALTER TABLE "location"
  ADD CONSTRAINT "location_itinerary_uuid_foreign" FOREIGN KEY ("itinerary_uuid"
  ) REFERENCES "itinerary" ("uuid") ON UPDATE CASCADE;

ALTER TABLE "diary_entry"
  ADD CONSTRAINT "diary_entry_user_uuid_foreign" FOREIGN KEY ("user_uuid")
  REFERENCES "user" ("uuid") ON UPDATE CASCADE;  