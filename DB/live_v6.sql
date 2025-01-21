--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Debian 16.6-1.pgdg110+1)
-- Dumped by pg_dump version 16.6 (Debian 16.6-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_logs (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    action character varying(100) NOT NULL,
    details text,
    performed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: admin_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_logs_id_seq OWNED BY public.admin_logs.id;


--
-- Name: blocked_lists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blocked_lists (
    user_id bigint NOT NULL,
    blocked_user_id bigint NOT NULL,
    blocked_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by_id bigint NOT NULL,
    updated_by_id bigint NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.likes (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    like_emote character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    type character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: schedule_streams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedule_streams (
    id bigint NOT NULL,
    scheduled_at timestamp with time zone NOT NULL,
    stream_id bigint NOT NULL,
    video_name text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: schedule_streams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schedule_streams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schedule_streams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schedule_streams_id_seq OWNED BY public.schedule_streams.id;


--
-- Name: shares; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shares (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: shares_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shares_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shares_id_seq OWNED BY public.shares.id;


--
-- Name: stream_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stream_analytics (
    id bigint NOT NULL,
    stream_id bigint NOT NULL,
    views bigint NOT NULL,
    likes bigint NOT NULL,
    comments bigint NOT NULL,
    video_size bigint NOT NULL,
    duration bigint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: stream_analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stream_analytics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stream_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stream_analytics_id_seq OWNED BY public.stream_analytics.id;


--
-- Name: stream_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stream_categories (
    category_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: streams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.streams (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    status character varying(50) NOT NULL,
    stream_token text,
    stream_key text NOT NULL,
    stream_type character varying(50) NOT NULL,
    thumbnail_file_name text NOT NULL,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: streams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.streams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: streams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.streams_id_seq OWNED BY public.streams.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id bigint NOT NULL,
    subscriber_id bigint NOT NULL,
    streamer_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: two_fas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.two_fas (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    secret text NOT NULL,
    is2fa_enabled boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: two_fas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.two_fas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: two_fas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.two_fas_id_seq OWNED BY public.two_fas.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(50) NOT NULL,
    display_name character varying(100),
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    otp character varying(6),
    otp_expires_at timestamp without time zone,
    role_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by_id bigint,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by_id bigint,
    deleted_at timestamp with time zone,
    deleted_by_id bigint,
    avatar_file_name character varying(255)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.views (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    view_type character varying(50) NOT NULL,
    is_viewing boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: views_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.views_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.views_id_seq OWNED BY public.views.id;


--
-- Name: admin_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_logs ALTER COLUMN id SET DEFAULT nextval('public.admin_logs_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: schedule_streams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_streams ALTER COLUMN id SET DEFAULT nextval('public.schedule_streams_id_seq'::regclass);


--
-- Name: shares id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shares ALTER COLUMN id SET DEFAULT nextval('public.shares_id_seq'::regclass);


--
-- Name: stream_analytics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stream_analytics ALTER COLUMN id SET DEFAULT nextval('public.stream_analytics_id_seq'::regclass);


--
-- Name: streams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.streams ALTER COLUMN id SET DEFAULT nextval('public.streams_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: two_fas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.two_fas ALTER COLUMN id SET DEFAULT nextval('public.two_fas_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: views id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.views ALTER COLUMN id SET DEFAULT nextval('public.views_id_seq'::regclass);


--
-- Data for Name: admin_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_logs (id, user_id, action, details, performed_at) FROM stdin;
1	1	login	 superAdmin@gmail.com logged in	2025-01-05 12:16:58.013992+00
3	3	create_admin	 user1@gmail.com created admin	2025-01-05 12:18:05.056107+00
4	1	create_category	 superAdmin@gmail.com create_category request	2025-01-05 12:19:49.132222+00
5	1	create_category	 superAdmin@gmail.com create_category request	2025-01-05 12:19:55.163957+00
6	1	create_category	 superAdmin@gmail.com create_category request	2025-01-05 12:20:00.718716+00
7	1	create_category	 superAdmin@gmail.com create_category request	2025-01-05 12:20:05.074716+00
2	2	create_admin	 streamer1@gmail.com created admin	2025-01-05 12:17:25.873104+00
8	2	update_user	 superAdmin@gmail.com update_user request	2025-01-05 12:21:30.687795+00
\.


--
-- Data for Name: blocked_lists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blocked_lists (user_id, blocked_user_id, blocked_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
1	coding	2025-01-05 12:19:49.123224+00	2025-01-05 12:19:49.123224+00	1	1
2	art	2025-01-05 12:19:55.153087+00	2025-01-05 12:19:55.153088+00	1	1
3	sport	2025-01-05 12:20:00.713706+00	2025-01-05 12:20:00.713707+00	1	1
4	game	2025-01-05 12:20:05.065182+00	2025-01-05 12:20:05.065182+00	1	1
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments (id, user_id, stream_id, comment, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.likes (id, user_id, stream_id, like_emote, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, user_id, stream_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, type, description, created_at, updated_at) FROM stdin;
1	super_admin	super_admin role	2025-01-05 12:16:28.400338+00	2025-01-05 12:16:28.400338+00
2	admin	Administrator role	2025-01-05 12:16:28.413777+00	2025-01-05 12:16:28.413777+00
3	streamer	Streamer role	2025-01-05 12:16:28.425119+00	2025-01-05 12:16:28.425119+00
4	user	Default user role	2025-01-05 12:16:28.429862+00	2025-01-05 12:16:28.429862+00
\.


--
-- Data for Name: schedule_streams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schedule_streams (id, scheduled_at, stream_id, video_name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: shares; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shares (id, user_id, stream_id, created_at) FROM stdin;
\.


--
-- Data for Name: stream_analytics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stream_analytics (id, stream_id, views, likes, comments, video_size, duration, created_at, updated_at) FROM stdin;
1	1	0	0	0	0	0	2025-01-05 12:22:04.534829+00	2025-01-05 12:22:04.534829+00
\.


--
-- Data for Name: stream_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stream_categories (category_id, stream_id, created_at) FROM stdin;
1	1	2025-01-05 12:22:04.492123+00
\.


--
-- Data for Name: streams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.streams (id, user_id, title, description, status, stream_token, stream_key, stream_type, thumbnail_file_name, started_at, ended_at, created_at, updated_at) FROM stdin;
1	2	kli	dsjjf	started	mIeUle7pvvSIO7nLaJ9oWbk0EAeEnf1zLTqu1oZk5Rm1Pkax	481918f6-66d6-4678-a3d3-b9dd2b0986d3	camera	2_1736079724424183177.png	2025-01-05 12:22:04.527236+00	\N	2025-01-05 12:22:04.492123+00	2025-01-05 12:22:04.528264+00
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscriptions (id, subscriber_id, streamer_id, created_at) FROM stdin;
\.


--
-- Data for Name: two_fas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.two_fas (id, user_id, secret, is2fa_enabled, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, display_name, email, password_hash, otp, otp_expires_at, role_id, created_at, created_by_id, updated_at, updated_by_id, deleted_at, deleted_by_id, avatar_file_name) FROM stdin;
1	superAdmin		superAdmin@gmail.com	$2a$14$WUeWeBEc5DgHbHssV9qb.eeTL4yWdUMqoHmferBgWhEKPiqc7PMd6		\N	1	2025-01-05 12:16:29.967262+00	\N	2025-01-05 12:16:29.967262+00	\N	\N	\N	\N
3	user1	User 1	user1@gmail.com	$2a$14$w/VhfwLphiEQwJ3/lsAkDec.4Z1y57w9.cEA4W7dyKwje635zpOsm		\N	4	2025-01-05 12:18:05.048575+00	1	2025-01-05 12:18:05.048575+00	1	\N	\N	\N
2	streamer1	Streamer 1	streamer1@gmail.com	$2a$14$RkFZzNROUOYCcVlW4szy7OZ8EdHDsXc52MuPn3yminbzdcZ0ZPFly		\N	3	2025-01-05 12:17:25.864177+00	1	2025-01-05 12:21:30.679617+00	1	\N	\N	\N
\.


--
-- Data for Name: views; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.views (id, user_id, stream_id, view_type, is_viewing, created_at, updated_at) FROM stdin;
1	2	1	live_view	t	2025-01-05 12:22:04.635583+00	2025-01-05 12:22:04.635583+00
\.


--
-- Name: admin_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_logs_id_seq', 8, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 4, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.likes_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- Name: schedule_streams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.schedule_streams_id_seq', 1, false);


--
-- Name: shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shares_id_seq', 1, false);


--
-- Name: stream_analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stream_analytics_id_seq', 1, true);


--
-- Name: streams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.streams_id_seq', 1, true);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: two_fas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.two_fas_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.views_id_seq', 1, true);


--
-- Name: admin_logs admin_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_logs
    ADD CONSTRAINT admin_logs_pkey PRIMARY KEY (id);


--
-- Name: blocked_lists blocked_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_lists
    ADD CONSTRAINT blocked_lists_pkey PRIMARY KEY (user_id, blocked_user_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: schedule_streams schedule_streams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_streams
    ADD CONSTRAINT schedule_streams_pkey PRIMARY KEY (id);


--
-- Name: shares shares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT shares_pkey PRIMARY KEY (id);


--
-- Name: stream_analytics stream_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stream_analytics
    ADD CONSTRAINT stream_analytics_pkey PRIMARY KEY (id);


--
-- Name: stream_categories stream_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stream_categories
    ADD CONSTRAINT stream_categories_pkey PRIMARY KEY (category_id, stream_id);


--
-- Name: streams streams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.streams
    ADD CONSTRAINT streams_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: two_fas two_fas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.two_fas
    ADD CONSTRAINT two_fas_pkey PRIMARY KEY (id);


--
-- Name: categories uni_categories_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT uni_categories_name UNIQUE (name);


--
-- Name: roles uni_roles_type; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT uni_roles_type UNIQUE (type);


--
-- Name: stream_analytics uni_stream_analytics_stream_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stream_analytics
    ADD CONSTRAINT uni_stream_analytics_stream_id UNIQUE (stream_id);


--
-- Name: two_fas uni_two_fas_user_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.two_fas
    ADD CONSTRAINT uni_two_fas_user_id UNIQUE (user_id);


--
-- Name: users uni_users_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uni_users_email UNIQUE (email);


--
-- Name: users uni_users_username; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uni_users_username UNIQUE (username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: views views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.views
    ADD CONSTRAINT views_pkey PRIMARY KEY (id);


--
-- Name: idx_streamer_subscriber; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_streamer_subscriber ON public.subscriptions USING btree (subscriber_id, streamer_id);


--
-- Name: idx_user_stream; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_user_stream ON public.likes USING btree (user_id, stream_id);


--
-- Name: idx_users_created_by_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_created_by_id ON public.users USING btree (created_by_id);


--
-- Name: idx_users_updated_by_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_updated_by_id ON public.users USING btree (updated_by_id);


--
-- Name: idx_view_user_stream; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_view_user_stream ON public.views USING btree (user_id, stream_id);


--
-- Name: blocked_lists fk_blocked_lists_blocked_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_lists
    ADD CONSTRAINT fk_blocked_lists_blocked_user FOREIGN KEY (blocked_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: blocked_lists fk_blocked_lists_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_lists
    ADD CONSTRAINT fk_blocked_lists_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: comments fk_comments_stream; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: comments fk_comments_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: likes fk_likes_stream; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT fk_likes_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: likes fk_likes_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications fk_notifications_stream; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: notifications fk_notifications_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users fk_roles_users; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_roles_users FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: schedule_streams fk_schedule_streams_stream; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_streams
    ADD CONSTRAINT fk_schedule_streams_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: shares fk_shares_stream; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT fk_shares_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: shares fk_shares_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT fk_shares_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: stream_analytics fk_stream_analytics_stream; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stream_analytics
    ADD CONSTRAINT fk_stream_analytics_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: stream_categories fk_stream_categories_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stream_categories
    ADD CONSTRAINT fk_stream_categories_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: stream_categories fk_stream_categories_stream; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stream_categories
    ADD CONSTRAINT fk_stream_categories_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: streams fk_streams_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.streams
    ADD CONSTRAINT fk_streams_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: subscriptions fk_subscriptions_streamer; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT fk_subscriptions_streamer FOREIGN KEY (streamer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: subscriptions fk_subscriptions_subscriber; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT fk_subscriptions_subscriber FOREIGN KEY (subscriber_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: two_fas fk_two_fas_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.two_fas
    ADD CONSTRAINT fk_two_fas_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: admin_logs fk_users_admin_logs; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_logs
    ADD CONSTRAINT fk_users_admin_logs FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users fk_users_created_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: categories fk_users_created_by_categories; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT fk_users_created_by_categories FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: users fk_users_updated_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: categories fk_users_updated_by_categories; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT fk_users_updated_by_categories FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: views fk_views_stream; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.views
    ADD CONSTRAINT fk_views_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: views fk_views_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.views
    ADD CONSTRAINT fk_views_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

