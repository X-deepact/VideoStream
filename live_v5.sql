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
1	1	login	 superAdmin@gmail.com logged in	2025-01-08 06:15:21.777885+00
2	2	create_admin	 streamer1@gmail.com created admin	2025-01-08 06:16:03.008009+00
3	3	create_admin	 user1@gmail.com created admin	2025-01-08 06:16:26.506426+00
4	1	login	 superAdmin@gmail.com logged in	2025-01-08 06:17:52.869835+00
5	1	create_category	 superAdmin@gmail.com create_category request	2025-01-08 06:18:06.032101+00
6	1	create_category	 superAdmin@gmail.com create_category request	2025-01-08 06:18:17.561932+00
7	1	create_category	 superAdmin@gmail.com create_category request	2025-01-08 06:18:22.839294+00
8	1	create_category	 superAdmin@gmail.com create_category request	2025-01-08 06:18:29.169408+00
9	1	create_category	 superAdmin@gmail.com create_category request	2025-01-08 06:18:44.434659+00
10	1	login	 superAdmin@gmail.com logged in	2025-01-08 06:25:49.696851+00
11	4	create_admin	 streamer2@gmail.com created admin	2025-01-08 06:26:16.125783+00
12	5	create_admin	 user2@gmail.com created admin	2025-01-08 06:26:39.799261+00
13	6	create_admin	 user3@gmail.com created admin	2025-01-08 06:27:08.398548+00
14	1	login	 superAdmin@gmail.com logged in	2025-01-08 07:13:17.181322+00
15	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-08 07:45:03.342989+00
16	4	live_broad_cast_by_id	 Streamer 2 live_stream_broad_cast request	2025-01-08 07:45:05.057422+00
17	4	live_broad_cast_by_id	 Streamer 2 live_stream_broad_cast request	2025-01-08 07:46:37.352855+00
18	4	live_broad_cast_by_id	 Streamer 2 live_stream_broad_cast request	2025-01-08 07:47:29.501464+00
19	4	live_broad_cast_by_id	 Streamer 2 live_stream_broad_cast request	2025-01-08 07:47:41.349212+00
20	4	live_broad_cast_by_id	 Streamer 2 live_stream_broad_cast request	2025-01-08 07:47:59.709962+00
21	4	live_broad_cast_by_id	 Streamer 2 live_stream_broad_cast request	2025-01-08 07:49:24.514737+00
22	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-08 07:49:49.728525+00
23	4	live_broad_cast_by_id	 Streamer 2 live_stream_broad_cast request	2025-01-08 07:49:51.236641+00
24	1	login	 superAdmin@gmail.com logged in	2025-01-08 12:28:57.029902+00
25	1	login	 superAdmin@gmail.com logged in	2025-01-08 13:00:57.587564+00
26	1	login	 superAdmin@gmail.com logged in	2025-01-09 05:35:04.480574+00
27	1	create_user	 superAdmin@gmail.com make createUser request	2025-01-09 05:39:09.675364+00
28	7	login	 admin1@gmail.com logged in	2025-01-09 05:39:27.729285+00
29	7	login	 admin1@gmail.com logged in	2025-01-09 06:23:21.935132+00
30	1	login	 superAdmin@gmail.com logged in	2025-01-09 06:44:07.927036+00
31	1	create_user	 superAdmin@gmail.com make createUser request	2025-01-09 06:52:56.092981+00
32	1	create_user	 superAdmin@gmail.com make createUser request	2025-01-09 06:54:01.991802+00
33	1	create_user	 superAdmin@gmail.com created user with email user5@gmail.com and role user	2025-01-09 06:56:19.383617+00
34	1	login	superAdmin logged in.	2025-01-09 12:09:17.113032+00
35	1	login	superAdmin logged in.	2025-01-09 12:13:05.427542+00
36	7	login	admin1 logged in.	2025-01-09 12:27:22.295213+00
37	7	create_user	admin1 created impostersuperAdmin with role type user.	2025-01-09 12:53:53.717124+00
38	1	login	superAdmin logged in.	2025-01-09 14:02:55.962494+00
39	2	scheduled_stream_by_admin	superAdmin scheduled a live stream 10	2025-01-09 14:03:22.369994+00
40	4	scheduled_stream_by_admin	superAdmin scheduled a live stream 11	2025-01-09 14:05:27.485901+00
41	4	scheduled_stream_by_admin	superAdmin scheduled a live stream 12	2025-01-09 14:08:09.472199+00
42	4	scheduled_stream_by_admin	superAdmin scheduled a live stream 13	2025-01-09 14:11:09.759521+00
43	4	scheduled_stream_by_admin	superAdmin scheduled a live stream 14	2025-01-09 14:11:39.452023+00
44	1	login	superAdmin logged in.	2025-01-10 05:15:59.914011+00
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
1	game	2025-01-08 06:18:06.027243+00	2025-01-08 06:18:06.027243+00	1	1
2	sport	2025-01-08 06:18:17.533342+00	2025-01-08 06:18:17.533342+00	1	1
3	art	2025-01-08 06:18:22.827518+00	2025-01-08 06:18:22.827518+00	1	1
4	coding	2025-01-08 06:18:29.165881+00	2025-01-08 06:18:29.165881+00	1	1
5	nature	2025-01-08 06:18:44.411079+00	2025-01-08 06:18:44.411079+00	1	1
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
1	super_admin	super_admin role	2025-01-08 06:14:22.868868+00	2025-01-08 06:14:22.868868+00
2	admin	Administrator role	2025-01-08 06:14:22.871973+00	2025-01-08 06:14:22.871973+00
3	streamer	Streamer role	2025-01-08 06:14:22.872856+00	2025-01-08 06:14:22.872856+00
4	user	Default user role	2025-01-08 06:14:22.873776+00	2025-01-08 06:14:22.873776+00
\.


--
-- Data for Name: schedule_streams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schedule_streams (id, scheduled_at, stream_id, video_name, created_at, updated_at) FROM stdin;
1	2025-01-09 05:30:00+00	6	4_1736322303330634233.mp4	2025-01-08 07:45:03.337016+00	2025-01-08 07:45:03.337016+00
2	2025-01-09 17:30:00+00	7	4_1736322589708005455.mp4	2025-01-08 07:49:49.718412+00	2025-01-08 07:49:49.718412+00
3	2025-01-09 17:30:00+00	10	2_1736431402352172809.mp4	2025-01-09 14:03:22.362352+00	2025-01-09 14:03:22.362352+00
4	2025-01-10 15:31:00+00	11	4_1736431527443176817.mp4	2025-01-09 14:05:27.453856+00	2025-01-09 14:05:27.453856+00
5	2025-01-10 05:33:00+00	12	4_1736431689398162105.mp4	2025-01-09 14:08:09.427687+00	2025-01-09 14:08:09.427687+00
6	2025-01-11 05:32:00+00	13	4_1736431869709531506.mp4	2025-01-09 14:11:09.722971+00	2025-01-09 14:11:09.722971+00
7	2025-01-11 05:30:00+00	14	4_1736431899380156979.mp4	2025-01-09 14:11:39.407377+00	2025-01-09 14:11:39.407377+00
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
1	1	1	0	0	915559	9248000	2025-01-08 06:23:21.802567+00	2025-01-08 06:23:39.086124+00
2	2	1	0	0	296281	5040000	2025-01-08 06:24:09.842184+00	2025-01-08 06:24:19.86778+00
5	5	1	0	0	386887	5466667	2025-01-08 06:43:08.675848+00	2025-01-08 06:43:17.388871+00
6	6	1	0	0	7359607	27800000	2025-01-09 06:16:09.337827+00	2025-01-09 06:17:57.295132+00
3	3	2	0	0	594866	7166667	2025-01-08 06:28:32.77299+00	2025-01-09 06:19:01.001034+00
7	8	1	0	0	311923	3633333	2025-01-09 13:44:11.965028+00	2025-01-09 13:44:18.969802+00
8	9	1	0	0	3201915	45033333	2025-01-09 13:48:49.661976+00	2025-01-09 13:49:43.185137+00
9	10	0	0	0	6697029	108180998	2025-01-10 05:01:26.429095+00	2025-01-10 05:01:49.850085+00
10	7	0	0	0	6697029	108180998	2025-01-10 05:01:26.428574+00	2025-01-10 05:01:50.062089+00
4	4	3	0	0	235063	3433333	2025-01-08 06:29:07.983936+00	2025-01-10 05:10:49.577444+00
\.


--
-- Data for Name: stream_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stream_categories (category_id, stream_id, created_at) FROM stdin;
4	1	2025-01-08 06:23:21.773397+00
1	2	2025-01-08 06:24:09.823199+00
4	3	2025-01-08 06:28:32.736738+00
4	4	2025-01-08 06:29:07.952956+00
5	5	2025-01-08 06:43:08.647382+00
2	6	2025-01-08 07:45:03.337016+00
2	7	2025-01-08 07:49:49.718412+00
1	8	2025-01-09 13:44:11.935629+00
1	9	2025-01-09 13:48:49.603366+00
2	10	2025-01-09 14:03:22.362352+00
2	11	2025-01-09 14:05:27.453856+00
3	12	2025-01-09 14:08:09.427687+00
4	13	2025-01-09 14:11:09.722971+00
2	14	2025-01-09 14:11:39.407377+00
\.


--
-- Data for Name: streams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.streams (id, user_id, title, description, status, stream_token, stream_key, stream_type, thumbnail_file_name, started_at, ended_at, created_at, updated_at) FROM stdin;
1	2	video 1	Video 1	ended	Ng68eJTJDwZf7zyoUOqadEJ1bo35EtggZmzkamK3tLEJjxgL	c03842e2-a92f-460e-994d-b462f1b4050b	camera	2_1736317401735738878.png	2025-01-08 06:23:21.798751+00	2025-01-08 06:23:33.716893+00	2025-01-08 06:23:21.773397+00	2025-01-08 06:23:33.719153+00
2	2	Video 2	vdkbg	ended	DwyrkEOAukozxZa1XREHQHh6pvQaP1UPj4pcl5guOuKEOBUl	50e2d8c8-2ff2-4c1c-a32d-e85f46c7d9d4	camera	2_1736317449816581191.png	2025-01-08 06:24:09.839337+00	2025-01-08 06:24:19.183548+00	2025-01-08 06:24:09.823199+00	2025-01-08 06:24:19.185339+00
3	4	Video 3 By streamer2	Video 3 By streamer2	ended	sJ0CibOAzmHZcfJ120Emh7bWfBU7140VPuUVfpsB5ruhGZPg	0dfc0666-be3d-4d72-a189-4ebf1999a7b1	camera	4_1736317712688377739.png	2025-01-08 06:28:32.768671+00	2025-01-08 06:28:42.437562+00	2025-01-08 06:28:32.736738+00	2025-01-08 06:28:42.4389+00
4	4	Video 4 By streamer2	Video 4 By streamer2	ended	PulyegK6ehRaOFIRNnfcrnky2yspddyvRAn1ZbxcYACHIDQl	182bbc11-aefb-4f9f-b78c-201a9e085fa4	camera	4_1736317747951521782.png	2025-01-08 06:29:07.974475+00	2025-01-08 06:29:13.849707+00	2025-01-08 06:29:07.952956+00	2025-01-08 06:29:13.850801+00
5	2	Video 5 By streamer 1	Video 5 By streamer 1	ended	OFV4nlXi8Be8nl1mfaBQlNxsMxvRnQNigCzRMonOMJEjcUBA	777d617e-f6e9-4aa6-a886-c78aefe4be8a	camera	2_1736318588637070529.png	2025-01-08 06:43:08.670313+00	2025-01-08 06:43:16.582222+00	2025-01-08 06:43:08.647382+00	2025-01-08 06:43:16.58462+00
6	4	Scheudle v1 8	schedule_streams vkvkdfb	ended	goRVrHVtqfnBR4oYrIpqHNYJSB8bBqvQY0BDM8QtKW9rCfjz	d685847e-10ba-4f38-8f46-e4527891ba8f	pre_record	4_1736322303329436066.png	2025-01-09 06:16:09.332127+00	2025-01-09 06:16:14.600161+00	2025-01-08 07:45:03.337016+00	2025-01-09 06:16:14.600711+00
8	2	dvfd	vfdb	ended	LG0sYiCQHn16xT0DQtaF1GUh8EEWRbPfc67K2Gizq700rVmG	707cbd31-43a6-43f8-b6e5-30aad9adbb55	camera	2_1736430251877595264.png	2025-01-09 13:44:11.959704+00	2025-01-09 13:44:18.170758+00	2025-01-09 13:44:11.935629+00	2025-01-09 13:44:18.172083+00
9	2	hello	vkfdjfv	ended	ORPaOygshShckX8k5FDVp5GU5LSTzGPnF3OQDi7LETFewuqH	77d93f53-6252-49a9-881d-28906f688110	camera	2_1736430529592369590.png	2025-01-09 13:48:49.653342+00	2025-01-09 13:49:37.387486+00	2025-01-09 13:48:49.603366+00	2025-01-09 13:49:37.389803+00
11	4	kds	jdvf	upcoming	\N	fbebb752-520f-467c-8196-9ad309547688	pre_record	4_1736431527435611011.png	\N	\N	2025-01-09 14:05:27.453856+00	2025-01-09 14:05:27.453856+00
12	4	fvdb	fvdjbj	upcoming	\N	5658b163-b8c7-45c7-aca5-03f77907089d	pre_record	4_1736431689396533728.png	\N	\N	2025-01-09 14:08:09.427687+00	2025-01-09 14:08:09.427687+00
13	4	sdkskf	fjvdjb	upcoming	\N	c2d7f3f5-526f-406c-872b-86eb43a249b6	pre_record	4_1736431869708941629.png	\N	\N	2025-01-09 14:11:09.722971+00	2025-01-09 14:11:09.722971+00
14	4	fdbgfj	vfdhbgf	upcoming	\N	cd29c847-dbfe-4f28-9060-1e86fb71e8cb	pre_record	4_1736431899378749985.png	\N	\N	2025-01-09 14:11:39.407377+00	2025-01-09 14:11:39.407377+00
10	2	fdvj	vfdbjg	ended	6IWzJTtQXuvrd7nlfMdrN9SYY6fDM2ZvyMftna4lXh69c2CJ	d4b1b477-8823-4aa6-85e0-191a79cd41d9	pre_record	2_1736431402350350389.png	2025-01-10 05:01:26.420873+00	2025-01-10 05:01:38.475331+00	2025-01-09 14:03:22.362352+00	2025-01-10 05:01:38.476167+00
7	4	cndsvf	dvfdnb	ended	4RvZMLqp6kHac4TwR6oQS8BuPq2sHGgPAQ3rBR285MJGJNvP	9b205d63-78c3-4d44-8fe8-f9a80e7ef1b1	pre_record	4_1736322589702316892.png	2025-01-10 05:01:26.420838+00	2025-01-10 05:01:38.530686+00	2025-01-08 07:49:49.718412+00	2025-01-10 05:01:38.531153+00
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscriptions (id, subscriber_id, streamer_id, created_at) FROM stdin;
1	3	2	2025-01-08 06:29:50.911274+00
2	5	4	2025-01-08 06:31:50.449333+00
35	5	2	2025-01-08 06:47:05.85555+00
36	6	4	2025-01-08 07:01:01.77059+00
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
1	superAdmin		superAdmin@gmail.com	$2a$14$T/Q33jXKBZkdeVjlqRf5D.tEIFO9PypM2uz/nX477hqSMTqQxuZBm		\N	1	2025-01-08 06:14:23.701867+00	\N	2025-01-08 06:14:23.701867+00	\N	\N	\N	\N
5	user2	User 2	user2@gmail.com	$2a$14$8MIM6MPwI/JuG1DPo8uKzuimvS9vx7.TFH6QwBab8lwC1Ohz/NpXC		\N	4	2025-01-08 06:26:39.790553+00	1	2025-01-08 06:26:39.790553+00	1	\N	\N	\N
6	user3	User 3	user3@gmail.com	$2a$14$f3NS/JudHgShzKO2.8LDh.lVUGHR5T3AEdwioWg373YkE9g5UuL02		\N	4	2025-01-08 06:27:08.391557+00	1	2025-01-08 06:27:08.391557+00	1	\N	\N	\N
4	streamer2	Streamer 2	streamer2@gmail.com	$2a$14$JpjQvGhpfdVAXlm60jcTT.6Buqq0b1qG5TJm8S3V3v6Itc08PMflK		\N	3	2025-01-08 06:26:16.118027+00	1	2025-01-08 06:32:19.666267+00	1	\N	\N	1736317939656595523.jpeg
2	streamer1	Streamer 1	streamer1@gmail.com	$2a$14$eqoNTR81aDA3V8B0X8CeXe54xCtxAgSOFFNalx.37gjJQakeWPs1G		\N	3	2025-01-08 06:16:03.00605+00	1	2025-01-08 06:32:50.045672+00	1	\N	\N	1736317970043846937.jpeg
3	user1	User 1	user1@gmail.com	$2a$14$PQK12Z8byqLH8Bn4E5EL3O9KXkMG.HqRSHYjdgiD9NYst9caeSXUy		\N	4	2025-01-08 06:16:26.504833+00	1	2025-01-08 06:39:18.860033+00	1	\N	\N	1736318358858036525.jpeg
7	admin1	Admin 1	admin1@gmail.com	$2a$14$EPysJChH7xnTd0VY3wJINOKY54lugDS5DFSXmqQ7ZcJmwur9DcfHK		\N	2	2025-01-09 05:39:09.671512+00	1	2025-01-09 05:39:09.671512+00	1	\N	\N	\N
8	Admin2	Admin 2	admin2@gmail.com	$2a$14$pAdJmkhtwbd8LqfeupTOnOG6jC/vQM.hLlY5NNgk524/aI.ipLwlS		\N	2	2025-01-09 06:52:56.085078+00	1	2025-01-09 06:52:56.085078+00	1	\N	\N	\N
9	user4	User 4	user4@gmail.com	$2a$14$chLOIZGq/./N8mV1OsSdJejpWDZurcb95VhTddI9QJtxmtywW899a		\N	4	2025-01-09 06:54:01.983403+00	1	2025-01-09 06:54:01.983403+00	1	\N	\N	\N
10	user5	User 5	user5@gmail.com	$2a$14$z7e.fsDp3gigTpBE2Kdg4u2CGPLlb/QRy65Cw5Qv41QBuDGO46LHK		\N	4	2025-01-09 06:56:19.380083+00	1	2025-01-09 06:56:19.380083+00	1	\N	\N	\N
11	impostersuperAdmin	Imposter Super Admin	impostersuperAdmin@gmail.com	$2a$14$XvUbVO5hJJboooeL1CPPPOOLaLAWrsKnlVtIST4nuxZjMG63i1xqa		\N	4	2025-01-09 12:53:53.708047+00	7	2025-01-09 12:53:53.708047+00	7	\N	\N	\N
\.


--
-- Data for Name: views; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.views (id, user_id, stream_id, view_type, is_viewing, created_at, updated_at) FROM stdin;
1	2	1	live_view	f	2025-01-08 06:23:21.871136+00	2025-01-08 06:23:33.753226+00
2	2	2	live_view	f	2025-01-08 06:24:09.881263+00	2025-01-08 06:24:19.216107+00
3	4	3	live_view	f	2025-01-08 06:28:32.903522+00	2025-01-08 06:28:42.463537+00
4	4	4	live_view	f	2025-01-08 06:29:08.056967+00	2025-01-08 06:29:13.875479+00
5	2	5	live_view	f	2025-01-08 06:43:08.701926+00	2025-01-08 06:43:16.611362+00
6	5	4	record_view	f	2025-01-08 06:44:47.658638+00	2025-01-08 06:44:47.658638+00
7	6	6	record_view	f	2025-01-09 06:17:57.292644+00	2025-01-09 06:18:36.741386+00
8	6	3	record_view	f	2025-01-09 06:19:00.993316+00	2025-01-09 06:19:34.158656+00
9	2	8	live_view	f	2025-01-09 13:44:12.032149+00	2025-01-09 13:44:18.194715+00
10	2	9	live_view	f	2025-01-09 13:48:49.851603+00	2025-01-09 13:49:37.420765+00
11	2	4	record_view	f	2025-01-10 05:10:49.575853+00	2025-01-10 05:11:30.133026+00
\.


--
-- Name: admin_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_logs_id_seq', 44, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 5, true);


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

SELECT pg_catalog.setval('public.schedule_streams_id_seq', 7, true);


--
-- Name: shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shares_id_seq', 1, false);


--
-- Name: stream_analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stream_analytics_id_seq', 10, true);


--
-- Name: streams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.streams_id_seq', 14, true);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 36, true);


--
-- Name: two_fas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.two_fas_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- Name: views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.views_id_seq', 11, true);


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

