set
  names 'utf8';

create table "user" (
  "uuid" varchar(255) not null,
  "email" varchar(255) not null,
  "password" varchar(255) not null,
  constraint "user_pkey" primary key ("uuid")
);

create table "diary_entry" (
  "uuid" varchar(255) not null,
  "title" varchar(255) not null,
  "description" varchar(255) null,
  "photo_uri" varchar(255) null,
  "price" int not null default 0,
  "rating" int not null default 0,
  "formatted_address" varchar(255) not null,
  "created_at" timestamptz not null,
  "user_uuid" varchar(255) not null,
  constraint "diary_entry_pkey" primary key ("uuid")
);

alter table
  "diary_entry"
add
  constraint "diary_entry_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade;
