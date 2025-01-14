--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

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
-- Name: admin_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_logs (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    action character varying(100) NOT NULL,
    details text,
    performed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin_logs OWNER TO postgres;

--
-- Name: admin_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admin_logs_id_seq OWNER TO postgres;

--
-- Name: admin_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_logs_id_seq OWNED BY public.admin_logs.id;


--
-- Name: blocked_lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blocked_lists (
    user_id bigint NOT NULL,
    blocked_user_id bigint NOT NULL,
    blocked_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.blocked_lists OWNER TO postgres;

--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookmarks (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.bookmarks OWNER TO postgres;

--
-- Name: bookmarks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookmarks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bookmarks_id_seq OWNER TO postgres;

--
-- Name: bookmarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookmarks_id_seq OWNED BY public.bookmarks.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by_id bigint NOT NULL,
    updated_by_id bigint NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.likes (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    like_emote character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.likes_id_seq OWNER TO postgres;

--
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    type character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: schedule_streams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule_streams (
    id bigint NOT NULL,
    scheduled_at timestamp with time zone NOT NULL,
    stream_id bigint NOT NULL,
    video_name text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.schedule_streams OWNER TO postgres;

--
-- Name: schedule_streams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_streams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.schedule_streams_id_seq OWNER TO postgres;

--
-- Name: schedule_streams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedule_streams_id_seq OWNED BY public.schedule_streams.id;


--
-- Name: shares; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shares (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.shares OWNER TO postgres;

--
-- Name: shares_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shares_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shares_id_seq OWNER TO postgres;

--
-- Name: shares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shares_id_seq OWNED BY public.shares.id;


--
-- Name: stream_analytics; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.stream_analytics OWNER TO postgres;

--
-- Name: stream_analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stream_analytics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stream_analytics_id_seq OWNER TO postgres;

--
-- Name: stream_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stream_analytics_id_seq OWNED BY public.stream_analytics.id;


--
-- Name: stream_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stream_categories (
    category_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.stream_categories OWNER TO postgres;

--
-- Name: streams; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.streams OWNER TO postgres;

--
-- Name: streams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.streams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.streams_id_seq OWNER TO postgres;

--
-- Name: streams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.streams_id_seq OWNED BY public.streams.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id bigint NOT NULL,
    subscriber_id bigint NOT NULL,
    streamer_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subscriptions_id_seq OWNER TO postgres;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: two_fas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.two_fas (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    secret text NOT NULL,
    is2fa_enabled boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.two_fas OWNER TO postgres;

--
-- Name: two_fas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.two_fas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.two_fas_id_seq OWNER TO postgres;

--
-- Name: two_fas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.two_fas_id_seq OWNED BY public.two_fas.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: views; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.views OWNER TO postgres;

--
-- Name: views_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.views_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.views_id_seq OWNER TO postgres;

--
-- Name: views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.views_id_seq OWNED BY public.views.id;


--
-- Name: admin_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_logs ALTER COLUMN id SET DEFAULT nextval('public.admin_logs_id_seq'::regclass);


--
-- Name: bookmarks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks ALTER COLUMN id SET DEFAULT nextval('public.bookmarks_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: schedule_streams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_streams ALTER COLUMN id SET DEFAULT nextval('public.schedule_streams_id_seq'::regclass);


--
-- Name: shares id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shares ALTER COLUMN id SET DEFAULT nextval('public.shares_id_seq'::regclass);


--
-- Name: stream_analytics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_analytics ALTER COLUMN id SET DEFAULT nextval('public.stream_analytics_id_seq'::regclass);


--
-- Name: streams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streams ALTER COLUMN id SET DEFAULT nextval('public.streams_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: two_fas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.two_fas ALTER COLUMN id SET DEFAULT nextval('public.two_fas_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: views id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.views ALTER COLUMN id SET DEFAULT nextval('public.views_id_seq'::regclass);


--
-- Data for Name: admin_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_logs (id, user_id, action, details, performed_at) FROM stdin;
1	1	login	 superAdmin@gmail.com logged in	2024-12-29 20:07:30.162466+06:30
2	1	login	 superAdmin@gmail.com logged in	2024-12-29 20:29:14.146814+06:30
3	1	login	 superAdmin@gmail.com logged in	2024-12-31 13:27:44.889208+06:30
4	1	login	 superAdmin@gmail.com logged in	2025-01-02 17:31:19.161922+06:30
5	1	login	 superAdmin@gmail.com logged in	2025-01-05 16:31:51.214515+06:30
6	1	login	 superAdmin@gmail.com logged in	2025-01-06 18:41:53.837091+06:30
7	5	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 18:46:22.140954+06:30
8	5	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 18:51:26.945456+06:30
9	1	login	superAdmin logged in.	2025-01-12 11:44:03.241147+06:30
10	1	login	superAdmin logged in.	2025-01-12 12:49:16.668045+06:30
11	1	login	superAdmin logged in.	2025-01-12 12:49:37.193692+06:30
12	1	login	superAdmin logged in.	2025-01-12 12:58:19.341841+06:30
13	1	login	superAdmin logged in.	2025-01-12 16:56:06.357263+06:30
\.


--
-- Data for Name: blocked_lists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blocked_lists (user_id, blocked_user_id, blocked_at) FROM stdin;
\.


--
-- Data for Name: bookmarks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookmarks (id, user_id, stream_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
1	Gaming	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
2	Music	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
3	Sport	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
4	IT	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
5	Marvel	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
6	MLBB	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
7	PUBG	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
8	DOTA2	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
9	Chat	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
10	DC	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
11	JavaScript	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
12	Programming	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
13	Software Development	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
14	AWS	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
15	GCD	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
16	Politics	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
17	Health & Mental Wellbeing	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
18	Charity	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
19	Entertainment	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
20	Movies	2024-12-29 16:09:57.9259+06:30	2024-12-29 16:09:57.9259+06:30	1	1
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, user_id, stream_id, comment, created_at, updated_at) FROM stdin;
15	5	7	great	2024-12-31 14:46:48.785662+06:30	2024-12-31 14:46:48.785662+06:30
16	5	8	live chat started	2024-12-31 16:10:11.513882+06:30	2024-12-31 16:10:11.513882+06:30
17	5	8	ok	2024-12-31 16:17:12.550484+06:30	2024-12-31 16:17:12.550484+06:30
18	5	8	this is text	2024-12-31 16:17:14.825647+06:30	2024-12-31 16:17:14.825647+06:30
19	5	8	and pay for the goods with the minimum of delays	2024-12-31 16:17:22.544736+06:30	2024-12-31 16:17:22.544736+06:30
20	5	11	great...	2024-12-31 18:20:01.882499+06:30	2024-12-31 18:20:01.882499+06:30
21	5	11	haha	2024-12-31 18:20:02.729873+06:30	2024-12-31 18:20:02.729873+06:30
22	5	14	hello haha	2024-12-31 20:17:26.628139+06:30	2024-12-31 20:17:26.628139+06:30
23	5	14	this is new comment	2024-12-31 20:17:29.613431+06:30	2024-12-31 20:17:29.613431+06:30
24	5	14	now previous one is not new anymore.	2024-12-31 20:17:37.782293+06:30	2024-12-31 20:17:37.782293+06:30
25	5	16	hello	2024-12-31 20:36:33.562603+06:30	2024-12-31 20:36:33.562603+06:30
26	5	16	ok stream	2024-12-31 20:36:35.597664+06:30	2024-12-31 20:36:35.597664+06:30
27	5	17	hello	2024-12-31 21:16:58.936437+06:30	2024-12-31 21:16:58.936437+06:30
28	5	17	ok	2024-12-31 21:16:59.879555+06:30	2024-12-31 21:16:59.879555+06:30
29	5	17	this is 3rd comment.	2024-12-31 21:17:04.280374+06:30	2024-12-31 21:17:04.280374+06:30
30	5	19	hello	2024-12-31 21:33:38.078652+06:30	2024-12-31 21:33:38.078652+06:30
31	5	19	i am giveing comments to you	2024-12-31 21:33:42.84706+06:30	2024-12-31 21:33:42.84706+06:30
32	5	19	are you receiving	2024-12-31 21:33:46.490083+06:30	2024-12-31 21:33:46.490083+06:30
33	5	20	hello	2025-01-01 11:50:37.559315+06:30	2025-01-01 11:50:37.559315+06:30
34	5	23	great 	2025-01-01 12:38:42.071704+06:30	2025-01-01 12:38:42.071704+06:30
35	5	23	haha	2025-01-01 12:38:42.911885+06:30	2025-01-01 12:38:42.911885+06:30
36	5	23	okay 3rd comment	2025-01-01 12:38:47.510262+06:30	2025-01-01 12:38:47.510262+06:30
37	5	24	ok	2025-01-01 13:06:03.989227+06:30	2025-01-01 13:06:03.989227+06:30
38	5	25	good	2025-01-01 13:07:15.374369+06:30	2025-01-01 13:07:15.374369+06:30
39	5	25	redirect test	2025-01-01 13:07:17.823726+06:30	2025-01-01 13:07:17.823726+06:30
40	5	27	hi	2025-01-01 13:14:18.883942+06:30	2025-01-01 13:14:18.883942+06:30
41	5	27	streamed again	2025-01-01 13:14:21.243923+06:30	2025-01-01 13:14:21.243923+06:30
42	5	27	just turned off the mic	2025-01-01 13:14:27.117587+06:30	2025-01-01 13:14:27.117587+06:30
43	1	27	ok	2025-01-01 13:14:47.461939+06:30	2025-01-01 13:14:47.461939+06:30
44	1	27	hello	2025-01-01 13:14:52.843708+06:30	2025-01-01 13:14:52.843708+06:30
45	5	27	hi	2025-01-01 13:53:40.631397+06:30	2025-01-01 13:53:40.631397+06:30
46	5	30	okay	2025-01-01 14:04:05.053207+06:30	2025-01-01 14:04:05.053207+06:30
47	5	30	haha	2025-01-01 14:04:07.374556+06:30	2025-01-01 14:04:07.374556+06:30
48	1	30	ok	2025-01-01 14:05:15.99342+06:30	2025-01-01 14:05:15.99342+06:30
49	1	30	ok 1	2025-01-01 14:05:46.773777+06:30	2025-01-01 14:05:46.773777+06:30
50	5	30	hi	2025-01-01 14:11:48.88121+06:30	2025-01-01 14:11:48.88121+06:30
51	5	30	still ok	2025-01-01 14:11:54.539514+06:30	2025-01-01 14:11:54.539514+06:30
52	1	31	hi	2025-01-01 14:13:43.546497+06:30	2025-01-01 14:13:43.546497+06:30
53	5	33	hello	2025-01-01 14:18:52.642288+06:30	2025-01-01 14:18:52.642288+06:30
54	5	33	welcome to my new stream	2025-01-01 14:18:55.745718+06:30	2025-01-01 14:18:55.745718+06:30
55	1	33	hi chief	2025-01-01 14:19:09.81128+06:30	2025-01-01 14:19:09.81128+06:30
56	1	33	how are you?	2025-01-01 14:19:12.959857+06:30	2025-01-01 14:19:12.959857+06:30
57	5	35	hi guys	2025-01-01 14:24:35.095381+06:30	2025-01-01 14:24:35.095381+06:30
58	5	35	welcome to my stream	2025-01-01 14:24:38.500391+06:30	2025-01-01 14:24:38.500391+06:30
59	1	35	hello	2025-01-01 14:25:35.649314+06:30	2025-01-01 14:25:35.649314+06:30
60	1	35	how are you?	2025-01-01 14:25:38.82109+06:30	2025-01-01 14:25:38.82109+06:30
61	1	35	happy new year	2025-01-01 14:25:51.184029+06:30	2025-01-01 14:25:51.184029+06:30
62	5	35	thank you	2025-01-01 14:25:58.35176+06:30	2025-01-01 14:25:58.35176+06:30
63	5	35	thank you 1	2025-01-01 14:26:07.92891+06:30	2025-01-01 14:26:07.92891+06:30
64	5	35	thank you 2	2025-01-01 14:26:11.289661+06:30	2025-01-01 14:26:11.289661+06:30
65	5	35	thank you 3	2025-01-01 14:26:12.572636+06:30	2025-01-01 14:26:12.572636+06:30
66	5	35	thank you 4	2025-01-01 14:26:14.410954+06:30	2025-01-01 14:26:14.410954+06:30
67	5	35	thank you 5	2025-01-01 14:26:16.088471+06:30	2025-01-01 14:26:16.088471+06:30
68	5	37	hi	2025-01-01 14:45:30.559256+06:30	2025-01-01 14:45:30.559256+06:30
69	5	37	welcome to my stream	2025-01-01 14:45:35.947645+06:30	2025-01-01 14:45:35.947645+06:30
70	1	37	hi	2025-01-01 14:45:51.432131+06:30	2025-01-01 14:45:51.432131+06:30
71	5	39	hi	2025-01-01 15:36:07.183025+06:30	2025-01-01 15:36:07.183025+06:30
72	5	39	welcome	2025-01-01 15:36:08.14886+06:30	2025-01-01 15:36:08.14886+06:30
73	5	41	hi	2025-01-01 16:06:55.548963+06:30	2025-01-01 16:06:55.548963+06:30
74	5	41	welcome	2025-01-01 16:06:57.134713+06:30	2025-01-01 16:06:57.134713+06:30
75	1	41	hello	2025-01-01 16:07:20.419585+06:30	2025-01-01 16:07:20.419585+06:30
76	1	41	thanks 	2025-01-01 16:07:25.182683+06:30	2025-01-01 16:07:25.182683+06:30
77	1	41	thank 2	2025-01-01 16:07:27.601092+06:30	2025-01-01 16:07:27.601092+06:30
78	1	41	thank 3	2025-01-01 16:07:28.703083+06:30	2025-01-01 16:07:28.703083+06:30
79	5	42	hi	2025-01-01 16:14:41.713501+06:30	2025-01-01 16:14:41.713501+06:30
80	5	42	welcome to my stream	2025-01-01 16:14:44.278416+06:30	2025-01-01 16:14:44.278416+06:30
81	2	42	hello	2025-01-01 16:15:06.803788+06:30	2025-01-01 16:15:06.803788+06:30
82	2	42	how are you	2025-01-01 16:15:08.911729+06:30	2025-01-01 16:15:08.911729+06:30
83	5	42	i'm good	2025-01-01 16:15:13.706391+06:30	2025-01-01 16:15:13.706391+06:30
84	5	44	hi	2025-01-01 16:26:52.342772+06:30	2025-01-01 16:26:52.342772+06:30
85	5	44	welcome to my stream	2025-01-01 16:26:55.295898+06:30	2025-01-01 16:26:55.295898+06:30
86	2	44	hi	2025-01-01 16:27:12.401644+06:30	2025-01-01 16:27:12.401644+06:30
87	2	44	how are you?	2025-01-01 16:27:14.552843+06:30	2025-01-01 16:27:14.552843+06:30
88	5	44	i'm fine	2025-01-01 16:27:18.93716+06:30	2025-01-01 16:27:18.93716+06:30
89	5	45	hello	2025-01-01 16:29:21.190481+06:30	2025-01-01 16:29:21.190481+06:30
90	5	45	welcome to my stream	2025-01-01 16:29:23.865689+06:30	2025-01-01 16:29:23.865689+06:30
91	2	45	hi thank you 1	2025-01-01 16:29:30.475133+06:30	2025-01-01 16:29:30.475133+06:30
92	2	45	thank you 2	2025-01-01 16:29:33.025308+06:30	2025-01-01 16:29:33.025308+06:30
93	5	45	hi i commented after live ends	2025-01-01 16:42:20.197269+06:30	2025-01-01 16:42:20.197269+06:30
94	2	47	hi	2025-01-01 20:10:11.91065+06:30	2025-01-01 20:10:11.91065+06:30
95	2	47	still working after refactoring	2025-01-01 20:10:17.752643+06:30	2025-01-01 20:10:17.752643+06:30
96	5	47	you good	2025-01-01 20:10:33.190655+06:30	2025-01-01 20:10:33.190655+06:30
97	5	47	i good	2025-01-01 20:10:34.896051+06:30	2025-01-01 20:10:34.896051+06:30
98	5	47	everybody good	2025-01-01 20:10:37.841501+06:30	2025-01-01 20:10:37.841501+06:30
99	2	47	yeah haha	2025-01-01 20:10:45.638614+06:30	2025-01-01 20:10:45.638614+06:30
100	5	48	ok	2025-01-01 20:14:39.077888+06:30	2025-01-01 20:14:39.077888+06:30
101	2	48	great	2025-01-01 20:14:42.840486+06:30	2025-01-01 20:14:42.840486+06:30
103	5	49	ok	2025-01-01 20:32:39.62904+06:30	2025-01-01 20:32:39.62904+06:30
104	5	49	thanks	2025-01-01 20:32:40.5454+06:30	2025-01-01 20:32:40.5454+06:30
102	2	49	love you hehe	2025-01-01 20:32:34.028224+06:30	2025-01-01 20:34:54.188079+06:30
105	2	50	hi	2025-01-01 20:46:45.457661+06:30	2025-01-01 20:46:45.457661+06:30
106	5	51	hello	2025-01-02 13:22:50.150824+06:30	2025-01-02 13:22:50.150824+06:30
107	5	51	still working	2025-01-02 13:22:52.532967+06:30	2025-01-02 13:22:52.532967+06:30
108	5	51	hehe	2025-01-02 13:23:01.454848+06:30	2025-01-02 13:23:01.454848+06:30
109	5	52	hi	2025-01-02 13:58:16.946406+06:30	2025-01-02 13:58:16.946406+06:30
110	2	52	great	2025-01-02 13:58:31.459924+06:30	2025-01-02 13:58:31.459924+06:30
111	5	52	okay	2025-01-02 13:58:41.026384+06:30	2025-01-02 13:58:41.026384+06:30
112	5	52	let's start	2025-01-02 13:58:42.711169+06:30	2025-01-02 13:58:42.711169+06:30
113	5	53	great	2025-01-02 14:05:49.599788+06:30	2025-01-02 14:05:49.599788+06:30
114	5	53	still working	2025-01-02 14:05:51.761227+06:30	2025-01-02 14:05:51.761227+06:30
115	2	53	same here	2025-01-02 14:06:04.212748+06:30	2025-01-02 14:06:04.212748+06:30
116	5	55	hello	2025-01-02 18:58:37.292748+06:30	2025-01-02 18:58:37.292748+06:30
117	5	55	okay	2025-01-02 18:58:38.379707+06:30	2025-01-02 18:58:38.379707+06:30
118	5	59	good	2025-01-02 19:26:46.839553+06:30	2025-01-02 19:26:46.839553+06:30
119	5	59	let's wait few minutes	2025-01-02 19:26:55.229886+06:30	2025-01-02 19:26:55.229886+06:30
120	2	62	good	2025-01-08 21:18:44.694663+06:30	2025-01-08 21:18:44.694663+06:30
121	2	62	okok	2025-01-08 21:18:57.531648+06:30	2025-01-08 21:18:57.531648+06:30
122	2	62	haha	2025-01-08 21:18:58.572243+06:30	2025-01-08 21:18:58.572243+06:30
123	2	62	to be part of this live viewer likes and comments	2025-01-08 21:19:06.288891+06:30	2025-01-08 21:19:06.288891+06:30
124	5	62	thank you guys	2025-01-08 21:19:17.275251+06:30	2025-01-08 21:19:17.275251+06:30
125	5	76	hi	2025-01-09 16:40:45.236241+06:30	2025-01-09 16:40:45.236241+06:30
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.likes (id, user_id, stream_id, like_emote, created_at, updated_at) FROM stdin;
53	2	45	heart	2025-01-01 16:29:27.470515+06:30	2025-01-01 16:29:27.470515+06:30
52	5	45	wow	2025-01-01 16:29:08.440037+06:30	2025-01-01 16:29:36.442711+06:30
54	5	46	heart	2025-01-01 20:08:48.122554+06:30	2025-01-01 20:09:11.546205+06:30
55	5	47	heart	2025-01-01 20:10:04.26892+06:30	2025-01-01 20:10:22.473309+06:30
58	5	48	heart	2025-01-01 20:14:36.832229+06:30	2025-01-01 20:14:36.832229+06:30
60	5	49	laugh	2025-01-01 20:32:41.725162+06:30	2025-01-01 20:32:41.725162+06:30
61	5	50	heart	2025-01-01 20:46:20.925801+06:30	2025-01-01 20:46:23.42493+06:30
63	5	51	heart	2025-01-02 13:22:46.95499+06:30	2025-01-02 13:22:48.197339+06:30
64	5	52	laugh	2025-01-02 13:58:14.377417+06:30	2025-01-02 13:58:14.377417+06:30
66	5	53	heart	2025-01-02 14:05:47.137335+06:30	2025-01-02 14:05:47.137335+06:30
68	5	55	laugh	2025-01-02 18:58:35.450212+06:30	2025-01-02 18:58:35.450212+06:30
69	5	58	laugh	2025-01-02 19:15:00.976884+06:30	2025-01-02 19:15:01.748101+06:30
70	5	59	heart	2025-01-02 19:26:45.471517+06:30	2025-01-02 19:26:45.471517+06:30
15	5	7	dislike	2024-12-31 14:46:47.236564+06:30	2024-12-31 15:58:27.034334+06:30
16	5	8	like	2024-12-31 16:10:07.128675+06:30	2024-12-31 16:10:07.128675+06:30
17	5	11	heart	2024-12-31 18:19:59.010402+06:30	2024-12-31 18:19:59.010402+06:30
18	5	13	laugh	2024-12-31 19:51:41.6013+06:30	2024-12-31 19:51:41.6013+06:30
19	5	14	laugh	2024-12-31 20:17:16.539159+06:30	2024-12-31 20:17:16.539159+06:30
20	5	15	heart	2024-12-31 20:32:13.289159+06:30	2024-12-31 20:32:13.289159+06:30
21	5	16	wow	2024-12-31 20:36:29.713687+06:30	2024-12-31 20:36:29.713687+06:30
22	5	17	heart	2024-12-31 21:16:56.29237+06:30	2024-12-31 21:16:56.29237+06:30
23	5	18	laugh	2024-12-31 21:31:28.305661+06:30	2024-12-31 21:31:28.305661+06:30
24	5	19	laugh	2024-12-31 21:33:35.945906+06:30	2024-12-31 21:33:35.945906+06:30
25	5	21	laugh	2025-01-01 11:57:17.875411+06:30	2025-01-01 11:57:24.69137+06:30
26	5	22	laugh	2025-01-01 12:02:50.086247+06:30	2025-01-01 12:02:50.086247+06:30
27	5	23	laugh	2025-01-01 12:36:47.061931+06:30	2025-01-01 12:36:47.061931+06:30
28	5	24	laugh	2025-01-01 13:06:01.990647+06:30	2025-01-01 13:06:01.990647+06:30
29	5	25	heart	2025-01-01 13:07:13.558435+06:30	2025-01-01 13:07:13.558435+06:30
30	5	26	heart	2025-01-01 13:09:26.06479+06:30	2025-01-01 13:09:26.06479+06:30
31	5	27	laugh	2025-01-01 13:14:17.024679+06:30	2025-01-01 13:14:17.024679+06:30
32	5	30	laugh	2025-01-01 14:04:00.95566+06:30	2025-01-01 14:04:00.95566+06:30
33	1	30	heart	2025-01-01 14:04:17.169946+06:30	2025-01-01 14:04:17.169946+06:30
35	5	31	heart	2025-01-01 14:13:15.473305+06:30	2025-01-01 14:17:02.574766+06:30
40	1	33	heart	2025-01-01 14:20:38.294475+06:30	2025-01-01 14:20:38.294475+06:30
37	5	33	dislike	2025-01-01 14:18:47.978238+06:30	2025-01-01 14:23:07.476498+06:30
42	1	35	heart	2025-01-01 14:25:32.349513+06:30	2025-01-01 14:25:32.349513+06:30
41	5	35	heart	2025-01-01 14:24:32.843123+06:30	2025-01-01 14:26:24.382012+06:30
43	5	37	laugh	2025-01-01 14:45:29.373481+06:30	2025-01-01 14:45:29.373481+06:30
44	1	37	heart	2025-01-01 14:45:49.274258+06:30	2025-01-01 14:45:49.274258+06:30
45	5	39	laugh	2025-01-01 15:36:05.737982+06:30	2025-01-01 15:36:05.737982+06:30
47	1	41	heart	2025-01-01 16:07:21.651153+06:30	2025-01-01 16:07:21.651153+06:30
46	5	41	dislike	2025-01-01 16:06:53.447549+06:30	2025-01-01 16:08:30.97428+06:30
48	5	42	laugh	2025-01-01 16:14:39.734032+06:30	2025-01-01 16:14:39.734032+06:30
51	2	44	heart	2025-01-01 16:27:04.570004+06:30	2025-01-01 16:27:04.570004+06:30
50	5	44	heart	2025-01-01 16:26:51.168657+06:30	2025-01-01 16:27:08.754888+06:30
83	5	62	laugh	2025-01-08 21:19:53.580165+06:30	2025-01-08 21:19:53.580165+06:30
84	5	76	laugh	2025-01-09 16:40:43.959296+06:30	2025-01-09 16:40:43.959296+06:30
85	5	87	laugh	2025-01-09 17:13:59.363164+06:30	2025-01-09 17:13:59.363164+06:30
86	5	92	laugh	2025-01-09 18:51:02.494697+06:30	2025-01-09 18:51:02.494697+06:30
87	5	96	heart	2025-01-09 20:42:47.965743+06:30	2025-01-09 20:42:47.965743+06:30
88	5	97	heart	2025-01-09 20:44:22.61173+06:30	2025-01-09 20:44:22.61173+06:30
89	5	98	heart	2025-01-09 21:56:09.739604+06:30	2025-01-09 21:56:09.739604+06:30
90	5	99	heart	2025-01-09 22:31:22.281665+06:30	2025-01-09 22:31:22.281665+06:30
91	2	65	heart	2025-01-10 14:59:41.806115+06:30	2025-01-10 14:59:41.806115+06:30
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, stream_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, type, description, created_at, updated_at) FROM stdin;
1	super_admin	super_admin role	2024-12-29 15:55:00.104021+06:30	2024-12-29 15:55:00.104021+06:30
2	admin	Administrator role	2024-12-29 15:55:00.104928+06:30	2024-12-29 15:55:00.104928+06:30
3	streamer	Streamer role	2024-12-29 15:55:00.105313+06:30	2024-12-29 15:55:00.105313+06:30
4	user	Default user role	2024-12-29 15:55:00.105715+06:30	2024-12-29 15:55:00.105715+06:30
\.


--
-- Data for Name: schedule_streams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_streams (id, scheduled_at, stream_id, video_name, created_at, updated_at) FROM stdin;
1	2025-01-08 21:02:00+06:30	60	5_1736165782094374000.mp4	2025-01-06 18:46:22.115813+06:30	2025-01-06 18:46:22.115813+06:30
2	2025-01-08 22:34:00+06:30	61	5_1736166086890182000.mp4	2025-01-06 18:51:26.929423+06:30	2025-01-06 18:51:26.929423+06:30
\.


--
-- Data for Name: shares; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shares (id, user_id, stream_id, created_at) FROM stdin;
\.


--
-- Data for Name: stream_analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stream_analytics (id, stream_id, views, likes, comments, video_size, duration, created_at, updated_at) FROM stdin;
7	7	1	1	1	258619	6233000	2024-12-31 14:46:43.347492+06:30	2024-12-31 15:58:27.044392+06:30
8	8	2	1	4	60454609	1358833000	2024-12-31 16:09:57.888651+06:30	2024-12-31 16:32:39.690358+06:30
9	11	1	1	2	73331004	1064166999	2024-12-31 18:19:56.532498+06:30	2024-12-31 18:37:43.82942+06:30
10	12	1	0	0	17292976	396600000	2024-12-31 18:39:17.141585+06:30	2024-12-31 18:45:56.378741+06:30
11	13	1	1	0	15854456	379134000	2024-12-31 19:51:36.026443+06:30	2024-12-31 19:57:58.716136+06:30
12	14	1	1	3	17915855	408600000	2024-12-31 20:14:00.681049+06:30	2024-12-31 20:21:07.9019+06:30
13	15	1	1	0	8249486	196766000	2024-12-31 20:32:06.594059+06:30	2024-12-31 20:35:27.972849+06:30
14	16	1	1	2	83798021	2341166000	2024-12-31 20:36:06.541241+06:30	2024-12-31 21:15:10.29582+06:30
15	17	1	1	3	35562557	841000000	2024-12-31 21:16:53.473382+06:30	2024-12-31 21:30:58.84102+06:30
49	58	1	1	0	399559	10599675	2025-01-02 19:09:27.935339+06:30	2025-01-08 13:45:49.358657+06:30
17	19	1	1	3	49040191	1169100000	2024-12-31 21:33:33.696884+06:30	2024-12-31 21:53:05.6565+06:30
18	20	1	0	1	7128153	169900000	2025-01-01 11:50:16.638091+06:30	2025-01-01 11:53:09.261965+06:30
19	21	1	1	0	12396301	346780000	2025-01-01 11:54:59.047636+06:30	2025-01-01 12:00:48.513111+06:30
20	22	1	1	0	16301721	494600000	2025-01-01 12:02:47.137116+06:30	2025-01-01 12:11:04.473263+06:30
21	23	2	1	3	35494158	1412200000	2025-01-01 12:36:43.549889+06:30	2025-01-01 13:00:18.403704+06:30
22	24	1	1	1	240186	7007000	2025-01-01 13:05:57.65006+06:30	2025-01-01 13:06:07.107189+06:30
23	25	1	1	2	1582492	50700000	2025-01-01 13:07:09.413003+06:30	2025-01-01 13:08:02.678166+06:30
24	26	1	1	0	67158	1634000	2025-01-01 13:09:24.069971+06:30	2025-01-01 13:09:28.27893+06:30
25	27	2	1	6	81183988	2373167000	2025-01-01 13:14:13.676733+06:30	2025-01-01 13:53:49.515167+06:30
26	30	2	2	6	21682858	494761000	2025-01-01 14:03:58.306395+06:30	2025-01-01 14:12:16.198089+06:30
27	31	2	1	1	10694410	249867000	2025-01-01 14:12:57.856621+06:30	2025-01-01 14:17:10.328584+06:30
28	33	2	2	4	11047366	264366000	2025-01-01 14:18:44.998202+06:30	2025-01-01 14:23:12.701522+06:30
29	35	2	2	11	32060796	916667000	2025-01-01 14:24:29.493798+06:30	2025-01-01 14:39:50.062086+06:30
30	37	2	2	3	76413514	1959929000	2025-01-01 14:45:27.314304+06:30	2025-01-01 15:18:13.068894+06:30
46	55	1	1	2	436603	10799675	2025-01-02 18:58:32.303165+06:30	2025-01-08 13:46:25.37016+06:30
31	39	2	1	2	98682144	1786134000	2025-01-01 15:36:03.587115+06:30	2025-01-01 16:05:53.010706+06:30
43	52	2	1	4	5070615	55800000	2025-01-02 13:58:01.242905+06:30	2025-01-08 13:46:28.599013+06:30
34	43	1	0	0	435275	6833000	2025-01-01 16:25:50.847378+06:30	2025-01-01 16:26:00.251693+06:30
35	44	2	2	5	3829665	36167000	2025-01-01 16:26:49.126406+06:30	2025-01-01 16:27:27.98034+06:30
36	45	2	2	5	6004571	58592000	2025-01-01 16:29:05.354255+06:30	2025-01-01 16:42:20.211433+06:30
42	51	1	1	3	1444495	40534000	2025-01-02 13:22:33.534298+06:30	2025-01-08 13:46:31.868142+06:30
41	50	2	1	1	3275804	28300000	2025-01-01 20:46:17.464903+06:30	2025-01-08 13:46:51.285115+06:30
39	48	2	1	2	4609203	44466000	2025-01-01 20:14:23.542258+06:30	2025-01-08 13:49:14.54779+06:30
61	70	0	0	0	33605704	588766016	2025-01-09 14:48:22.757567+06:30	2025-01-09 14:59:31.951636+06:30
38	47	2	1	6	6746554	55333000	2025-01-01 20:10:00.233581+06:30	2025-01-08 13:49:18.476011+06:30
37	46	1	1	0	2568392	21433000	2025-01-01 20:08:36.771284+06:30	2025-01-08 13:49:33.97499+06:30
45	54	1	0	0	509982	12745700	2025-01-02 18:57:49.481701+06:30	2025-01-02 18:58:05.574172+06:30
51	60	0	0	0	0	0	2025-01-08 21:02:35.966187+06:30	2025-01-08 21:02:35.966187+06:30
47	56	1	0	0	935223	7199349	2025-01-02 19:05:46.14698+06:30	2025-01-02 19:05:57.196392+06:30
48	57	1	0	0	376547	9175100	2025-01-02 19:07:54.177112+06:30	2025-01-02 19:08:06.437436+06:30
32	41	2	2	6	9182864	103133000	2025-01-01 16:06:51.339084+06:30	2025-01-10 15:05:20.591605+06:30
53	61	0	0	0	0	0	2025-01-08 22:34:44.910951+06:30	2025-01-08 22:34:44.910951+06:30
50	59	2	1	2	1588316	38637867	2025-01-02 19:26:43.568908+06:30	2025-01-07 16:58:50.572997+06:30
54	63	2	0	0	51271914	1534416341	2025-01-09 11:44:34.908283+06:30	2025-01-09 12:12:24.230888+06:30
16	18	1	1	0	1222123	27000000	2024-12-31 21:31:22.997869+06:30	2025-01-08 12:47:13.27217+06:30
44	53	2	1	3	3051585	37567000	2025-01-02 14:05:44.964759+06:30	2025-01-08 13:14:13.1453+06:30
33	42	2	1	5	4191737	70134000	2025-01-01 16:14:37.285647+06:30	2025-01-08 13:14:20.166964+06:30
55	64	1	0	0	31324204	887166341	2025-01-09 12:51:55.868449+06:30	2025-01-09 13:08:01.689004+06:30
40	49	2	1	3	2637178	25234000	2025-01-01 20:32:21.431498+06:30	2025-01-08 13:39:27.684336+06:30
64	73	0	0	0	2377940	42832683	2025-01-09 15:36:57.215869+06:30	2025-01-09 15:37:54.087922+06:30
62	71	1	0	0	116693081	2101033332	2025-01-09 14:59:00.344636+06:30	2025-01-09 15:39:00.238396+06:30
63	72	2	0	0	20663778	363183008	2025-01-09 15:34:43.516273+06:30	2025-01-09 15:41:28.050739+06:30
56	65	2	1	0	3455587	76682683	2025-01-09 13:08:02.250647+06:30	2025-01-10 15:04:39.497051+06:30
57	66	1	0	0	9297570	227099675	2025-01-09 13:12:37.398038+06:30	2025-01-09 13:16:45.324057+06:30
58	67	1	0	0	3441805	61233008	2025-01-09 13:17:34.877568+06:30	2025-01-09 13:18:46.260469+06:30
59	68	1	0	0	1060669	21733008	2025-01-09 13:57:09.491078+06:30	2025-01-09 13:57:36.728484+06:30
60	69	1	0	0	36449941	666266341	2025-01-09 14:36:55.644012+06:30	2025-01-09 14:49:22.712733+06:30
66	76	1	1	1	2358910	54699675	2025-01-09 16:40:40.080189+06:30	2025-01-09 16:41:46.785712+06:30
65	74	1	0	0	75383426	1819333008	2025-01-09 16:08:45.491251+06:30	2025-01-09 16:41:55.524024+06:30
67	78	1	0	0	3216351	74440667	2025-01-09 16:42:34.792162+06:30	2025-01-09 16:43:56.977881+06:30
68	80	1	0	0	22005342	495110600	2025-01-09 16:55:35.688609+06:30	2025-01-09 17:04:27.620114+06:30
69	84	1	0	0	1943212	43966016	2025-01-09 17:04:13.957153+06:30	2025-01-09 17:05:06.841615+06:30
70	85	1	0	0	6320295	138899349	2025-01-09 17:05:58.557327+06:30	2025-01-09 17:08:30.850127+06:30
71	86	1	0	0	8724284	203666341	2025-01-09 17:10:04.580297+06:30	2025-01-09 17:13:43.184115+06:30
72	87	1	1	0	3740994	76966341	2025-01-09 17:13:56.102457+06:30	2025-01-09 17:15:25.876493+06:30
73	88	1	0	0	3377664	101234100	2025-01-09 17:43:30.089506+06:30	2025-01-09 17:45:21.894339+06:30
74	89	1	0	0	4630036	140940433	2025-01-09 17:45:32.847218+06:30	2025-01-09 17:48:06.873456+06:30
75	90	2	0	0	10497698	246066341	2025-01-09 17:52:51.45489+06:30	2025-01-09 17:57:17.11582+06:30
76	91	1	0	0	0	3131853976	2025-01-09 17:58:01.349548+06:30	2025-01-09 18:50:13.740157+06:30
77	92	2	1	0	47650474	1007500000	2025-01-09 18:50:59.857212+06:30	2025-01-09 19:09:14.89897+06:30
78	93	1	0	0	4355900	84233008	2025-01-09 19:13:10.76292+06:30	2025-01-09 19:14:46.035558+06:30
79	94	2	0	0	4898028	99399349	2025-01-09 19:16:21.963116+06:30	2025-01-09 19:18:12.748485+06:30
80	95	1	0	0	3440073	82833008	2025-01-09 20:29:38.99287+06:30	2025-01-09 20:31:10.246722+06:30
81	96	1	1	0	1305714	30950000	2025-01-09 20:42:45.868481+06:30	2025-01-09 20:43:21.823963+06:30
82	97	1	1	0	3793239	87366341	2025-01-09 20:44:20.427361+06:30	2025-01-09 20:45:57.096177+06:30
83	98	1	1	0	14630092	256399675	2025-01-09 21:56:05.195949+06:30	2025-01-09 22:00:43.108663+06:30
52	62	2	1	5	10681529	167733008	2025-01-08 21:17:22.527266+06:30	2025-01-10 15:05:16.699574+06:30
84	99	3	1	0	5986996	100499667	2025-01-09 22:31:16.955615+06:30	2025-01-12 17:08:50.656402+06:30
\.


--
-- Data for Name: stream_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stream_categories (category_id, stream_id, created_at) FROM stdin;
1	7	2024-12-31 14:46:43.307517+06:30
1	8	2024-12-31 16:09:57.788228+06:30
5	8	2024-12-31 16:09:57.788228+06:30
4	9	2024-12-31 16:35:49.36295+06:30
1	10	2024-12-31 16:42:43.436886+06:30
4	10	2024-12-31 16:42:43.436886+06:30
1	11	2024-12-31 18:19:56.48728+06:30
1	12	2024-12-31 18:39:17.084574+06:30
4	13	2024-12-31 19:51:35.978407+06:30
4	14	2024-12-31 20:14:00.645158+06:30
5	15	2024-12-31 20:32:06.536691+06:30
2	16	2024-12-31 20:36:06.459784+06:30
5	17	2024-12-31 21:16:53.425967+06:30
4	18	2024-12-31 21:31:22.83343+06:30
5	19	2024-12-31 21:33:33.667288+06:30
2	20	2025-01-01 11:50:16.579327+06:30
5	21	2025-01-01 11:54:59.015305+06:30
4	22	2025-01-01 12:02:47.11307+06:30
4	23	2025-01-01 12:36:43.495871+06:30
5	24	2025-01-01 13:05:57.607491+06:30
5	25	2025-01-01 13:07:09.363661+06:30
3	26	2025-01-01 13:09:24.039088+06:30
5	27	2025-01-01 13:14:13.641577+06:30
5	28	2025-01-01 13:56:05.598015+06:30
2	29	2025-01-01 13:57:55.645396+06:30
4	30	2025-01-01 14:03:58.264076+06:30
1	31	2025-01-01 14:12:57.834823+06:30
5	32	2025-01-01 14:17:58.017389+06:30
4	33	2025-01-01 14:18:44.970931+06:30
4	34	2025-01-01 14:23:57.228371+06:30
4	35	2025-01-01 14:24:29.446278+06:30
5	36	2025-01-01 14:40:22.577411+06:30
4	37	2025-01-01 14:45:27.257039+06:30
2	38	2025-01-01 15:35:14.388548+06:30
2	39	2025-01-01 15:36:03.543052+06:30
5	40	2025-01-01 16:06:21.368943+06:30
4	41	2025-01-01 16:06:51.263292+06:30
4	42	2025-01-01 16:14:37.247929+06:30
5	43	2025-01-01 16:25:50.817633+06:30
4	44	2025-01-01 16:26:49.091747+06:30
4	45	2025-01-01 16:29:05.331291+06:30
1	46	2025-01-01 20:08:36.711214+06:30
4	47	2025-01-01 20:10:00.211741+06:30
4	48	2025-01-01 20:14:23.497591+06:30
4	49	2025-01-01 20:32:21.388048+06:30
4	50	2025-01-01 20:46:17.414625+06:30
1	51	2025-01-02 13:22:33.425561+06:30
4	52	2025-01-02 13:58:01.17836+06:30
5	53	2025-01-02 14:05:44.933605+06:30
4	54	2025-01-02 18:57:49.37442+06:30
5	55	2025-01-02 18:58:32.280915+06:30
4	56	2025-01-02 19:05:46.097312+06:30
4	57	2025-01-02 19:07:54.114279+06:30
5	58	2025-01-02 19:09:27.533837+06:30
4	59	2025-01-02 19:26:43.521341+06:30
3	60	2025-01-06 18:46:22.115813+06:30
4	60	2025-01-06 18:46:22.115813+06:30
5	60	2025-01-06 18:46:22.115813+06:30
7	61	2025-01-06 18:51:26.929423+06:30
6	61	2025-01-06 18:51:26.929423+06:30
19	62	2025-01-08 21:17:22.461868+06:30
8	62	2025-01-08 21:17:22.461868+06:30
10	62	2025-01-08 21:17:22.461868+06:30
10	63	2025-01-09 11:44:34.828641+06:30
9	63	2025-01-09 11:44:34.828641+06:30
8	63	2025-01-09 11:44:34.828641+06:30
8	64	2025-01-09 12:51:55.804368+06:30
19	64	2025-01-09 12:51:55.804368+06:30
15	64	2025-01-09 12:51:55.804368+06:30
17	65	2025-01-09 13:08:02.22771+06:30
13	65	2025-01-09 13:08:02.22771+06:30
12	65	2025-01-09 13:08:02.22771+06:30
17	66	2025-01-09 13:12:37.369345+06:30
19	66	2025-01-09 13:12:37.369345+06:30
13	66	2025-01-09 13:12:37.369345+06:30
15	67	2025-01-09 13:17:34.829253+06:30
17	67	2025-01-09 13:17:34.829253+06:30
19	67	2025-01-09 13:17:34.829253+06:30
18	68	2025-01-09 13:57:09.42065+06:30
9	68	2025-01-09 13:57:09.42065+06:30
10	68	2025-01-09 13:57:09.42065+06:30
15	69	2025-01-09 14:36:55.581085+06:30
19	69	2025-01-09 14:36:55.581085+06:30
8	69	2025-01-09 14:36:55.581085+06:30
15	70	2025-01-09 14:48:22.695293+06:30
8	70	2025-01-09 14:48:22.695293+06:30
19	70	2025-01-09 14:48:22.695293+06:30
19	71	2025-01-09 14:59:00.2742+06:30
9	71	2025-01-09 14:59:00.2742+06:30
14	71	2025-01-09 14:59:00.2742+06:30
8	72	2025-01-09 15:34:43.451762+06:30
19	72	2025-01-09 15:34:43.451762+06:30
15	72	2025-01-09 15:34:43.451762+06:30
9	73	2025-01-09 15:36:57.142366+06:30
10	73	2025-01-09 15:36:57.142366+06:30
15	74	2025-01-09 16:08:45.427105+06:30
9	74	2025-01-09 16:08:45.427105+06:30
10	74	2025-01-09 16:08:45.427105+06:30
15	75	2025-01-09 16:26:17.60009+06:30
14	76	2025-01-09 16:40:40.046586+06:30
18	76	2025-01-09 16:40:40.046586+06:30
9	76	2025-01-09 16:40:40.046586+06:30
14	77	2025-01-09 16:41:28.575217+06:30
19	77	2025-01-09 16:41:28.575217+06:30
14	78	2025-01-09 16:42:34.766893+06:30
18	78	2025-01-09 16:42:34.766893+06:30
9	78	2025-01-09 16:42:34.766893+06:30
14	79	2025-01-09 16:43:15.964633+06:30
19	79	2025-01-09 16:43:15.964633+06:30
14	80	2025-01-09 16:55:35.637807+06:30
18	80	2025-01-09 16:55:35.637807+06:30
9	80	2025-01-09 16:55:35.637807+06:30
14	81	2025-01-09 16:56:13.704243+06:30
19	81	2025-01-09 16:56:13.704243+06:30
14	82	2025-01-09 16:58:38.457307+06:30
19	82	2025-01-09 16:58:38.457307+06:30
14	83	2025-01-09 17:00:25.793623+06:30
19	83	2025-01-09 17:00:25.793623+06:30
14	84	2025-01-09 17:04:13.916586+06:30
18	84	2025-01-09 17:04:13.916586+06:30
9	84	2025-01-09 17:04:13.916586+06:30
14	85	2025-01-09 17:05:58.526847+06:30
18	85	2025-01-09 17:05:58.526847+06:30
9	85	2025-01-09 17:05:58.526847+06:30
14	86	2025-01-09 17:10:04.550409+06:30
18	86	2025-01-09 17:10:04.550409+06:30
9	86	2025-01-09 17:10:04.550409+06:30
14	87	2025-01-09 17:13:56.078936+06:30
19	87	2025-01-09 17:14:21.443155+06:30
14	88	2025-01-09 17:43:30.040416+06:30
18	88	2025-01-09 17:43:30.040416+06:30
9	88	2025-01-09 17:43:30.040416+06:30
14	89	2025-01-09 17:45:32.815651+06:30
19	89	2025-01-09 17:46:05.146099+06:30
14	90	2025-01-09 17:52:51.404551+06:30
19	90	2025-01-09 17:53:53.410032+06:30
14	91	2025-01-09 17:58:01.306453+06:30
19	91	2025-01-09 17:58:28.764862+06:30
14	92	2025-01-09 18:50:59.722776+06:30
19	92	2025-01-09 18:52:07.461341+06:30
1	93	2025-01-09 19:14:00.681689+06:30
17	93	2025-01-09 19:14:28.61823+06:30
19	93	2025-01-09 19:14:28.61823+06:30
14	94	2025-01-09 19:16:21.903561+06:30
17	94	2025-01-09 19:17:18.414373+06:30
14	95	2025-01-09 20:29:38.933752+06:30
18	95	2025-01-09 20:29:38.933752+06:30
9	95	2025-01-09 20:29:38.933752+06:30
14	96	2025-01-09 20:42:45.816955+06:30
18	96	2025-01-09 20:42:45.816955+06:30
9	96	2025-01-09 20:42:45.816955+06:30
14	97	2025-01-09 20:44:20.392031+06:30
14	98	2025-01-09 21:56:05.122409+06:30
19	97	2025-01-09 20:45:07.004413+06:30
15	98	2025-01-09 22:00:17.349006+06:30
1	98	2025-01-09 22:00:17.349006+06:30
17	99	2025-01-09 22:32:30.636424+06:30
\.


--
-- Data for Name: streams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.streams (id, user_id, title, description, status, stream_token, stream_key, stream_type, thumbnail_file_name, started_at, ended_at, created_at, updated_at) FROM stdin;
11	5	Stream 6	ok	ended	UOyH3sHJOaHPU99ay2BC1JkXxb1cpXIWWDMO0gQm22Dridzi	d2baed8a-db4e-441f-a025-f62b7d9dc727	camera	5_1735645796445323000.png	2024-12-31 18:19:56.5303+06:30	2024-12-31 18:37:43.054666+06:30	2024-12-31 18:19:56.48728+06:30	2024-12-31 18:37:43.070162+06:30
27	5	Stream 20	ok great	ended	qd4D4UoKx5rjbtJC1Hbndxh7YPOIRJKAb66w4AaGM5hrmZc0	d5a4120b-c1c2-4730-b7c5-99d9637343a6	camera	5_1735713853604560000.png	2025-01-01 13:14:13.675125+06:30	2025-01-01 13:53:49.212238+06:30	2025-01-01 13:14:13.641577+06:30	2025-01-01 13:53:49.215008+06:30
12	5	Stream 7	Ok	ended	xUDVjxpI6aPIU4Gg7l7iUDjCtpC6IWdGPZk4YROrFoftJmcB	c61cbf3a-6f90-4f59-a397-f709e1eb30d6	camera	5_1735646957054194000.png	2024-12-31 18:39:17.136683+06:30	2024-12-31 18:45:56.084477+06:30	2024-12-31 18:39:17.084574+06:30	2024-12-31 18:45:56.099164+06:30
21	5	Stream 15	ok	ended	1lyWRGydSlaOf8O2qVKGibBNkE6XhLls2KwZmZh3ntJ4fpTs	bf08ad5d-10af-4d63-a938-bf688363d525	camera	5_1735709098993140000.png	2025-01-01 11:54:59.044664+06:30	2025-01-01 12:00:48.257405+06:30	2025-01-01 11:54:59.015305+06:30	2025-01-01 12:00:48.262927+06:30
13	5	Stream 8	ok	ended	DBsMWI83MBAV14TDjPwYiTYtbmFuBkQK8tYmWXXHuRePi5jv	fe51bba4-6447-42a2-a614-0be85f35bd9c	camera	5_1735651295926633000.png	2024-12-31 19:51:36.025162+06:30	2024-12-31 19:57:57.564706+06:30	2024-12-31 19:51:35.978407+06:30	2024-12-31 19:57:57.568579+06:30
14	5	Stream 9	ok	ended	Vu2fwzwupgisMPLAJpzFtRIkwaf0ppXKXa7kpFcAJ0xsZEuA	60486df7-1371-4397-b5f3-44718bfb0db1	camera	5_1735652640599575000.png	2024-12-31 20:14:00.677804+06:30	2024-12-31 20:21:06.918104+06:30	2024-12-31 20:14:00.645158+06:30	2024-12-31 20:21:07.07473+06:30
28	5	stream 21	ok	pending	z1QfRzH2CBYkuSHWZ8OptYFdE3IcSeyDfS7YMZAAAMvhFTF2	7f2dbe7a-01c3-482e-86ca-f30e759482cd	camera	5_1735716365543127000.png	\N	\N	2025-01-01 13:56:05.598015+06:30	2025-01-01 13:56:05.598015+06:30
15	5	Stream 10	ok	ended	eaG2GOPTKocgjPQjqX5JmuQ4apAzDLIwqB3Jqmtks4CHVt9N	767d0c61-1600-4959-b16f-3524c1d6894b	camera	5_1735653726284252000.png	2024-12-31 20:32:06.592007+06:30	2024-12-31 20:35:26.942127+06:30	2024-12-31 20:32:06.536691+06:30	2024-12-31 20:35:26.970608+06:30
7	5	Stream 1	ok	ended	mF1vGhjGVGaZcbVcm5iz0hgFJmidv97M7WCBEjym1nYXHtiY	d59e0e5d-58ff-4de6-a74f-ddebf207f7b0	camera	5_1735633003249374000.jpg	2024-12-31 14:46:43.345407+06:30	2024-12-31 14:46:51.947256+06:30	2024-12-31 14:46:43.307517+06:30	2024-12-31 14:46:51.949344+06:30
8	5	Stream 2	ok	ended	Qm49J2aSVWKQASrrEbkfY9OwSwBNYy8kUo4Y5WPwA0t9ZrRr	17303a6e-a276-4229-850f-7f7a79075f5b	camera	5_1735637997735635000.jpeg	2024-12-31 16:09:57.885747+06:30	2024-12-31 16:32:39.097455+06:30	2024-12-31 16:09:57.788228+06:30	2024-12-31 16:32:39.115121+06:30
9	5	Stream 3	ok	ended	l4D4bJ9dBWnjSACe4md95foelEKYZICpxdtgshT6t9ysQKtk	ed58fd28-af9a-4df9-a5d9-38b4dc6ebe0a	camera	5_1735639549308250000.png	\N	\N	2024-12-31 16:35:49.36295+06:30	2024-12-31 16:35:49.36295+06:30
10	5	Stream 5	ok	ended	3uLM1beZzRddrixwMZGoFHStwO5Lo18JcSP2r0ZnzLzTPYbu	b081331b-e124-4428-a617-3ebf6127644e	camera	5_1735639963407089000.png	\N	\N	2024-12-31 16:42:43.436886+06:30	2024-12-31 16:42:43.436886+06:30
22	5	stream 16	ok	ended	GHcw6NAeQeiWVPxOCJbPmfdxMC3nzLkkVsn6BonrLfLWVvR2	88bcdfb8-24de-4267-8b13-01668f5618ad	camera	5_1735709567090589000.png	2025-01-01 12:02:47.1346+06:30	2025-01-01 12:11:04.103563+06:30	2025-01-01 12:02:47.11307+06:30	2025-01-01 12:11:04.122438+06:30
16	5	Stream 11	ok	ended	zAUGqyIdi13wVYWPNcOfkyQ1gdkfby7dmc3EXH36aHrGn8tK	356f1908-20f7-4e38-a030-b4eaa398f05e	camera	5_1735653966369000000.png	2024-12-31 20:36:06.538301+06:30	2024-12-31 21:15:10.069394+06:30	2024-12-31 20:36:06.459784+06:30	2024-12-31 21:15:10.081075+06:30
17	5	Stream 12	ok	ended	QAMRVN59btKmKZNmBpsWZPwEp2rr3G0q6TWgqON1ik2zvPog	0d8e8698-27bb-4e08-8a22-733e50fc40b9	camera	5_1735656413377305000.png	2024-12-31 21:16:53.47053+06:30	2024-12-31 21:30:57.380493+06:30	2024-12-31 21:16:53.425967+06:30	2024-12-31 21:30:57.418692+06:30
29	5	Stream 22	How	pending	IVuxtk8bPkKWO31jqwmunbFAYZdptgVFDoeVREC71hnTkF96	31e7e85c-b07f-4f94-bfa2-4003e20c9d0c	camera	5_1735716475601735000.png	\N	\N	2025-01-01 13:57:55.645396+06:30	2025-01-01 13:57:55.645396+06:30
18	5	Stream 13	ok	ended	l2FKmYXA6ER7OtKDPj1C4bHgcxMDwUyDesxWdOMD6DsfTh6y	bcc8ebc6-3f34-4c1a-bf2b-30581266f8f3	camera	5_1735657282473198000.png	2024-12-31 21:31:22.991351+06:30	2024-12-31 21:31:52.567495+06:30	2024-12-31 21:31:22.83343+06:30	2024-12-31 21:31:52.612215+06:30
23	5	Stream 17	ok	ended	xYVy5GrR6AYvseONDi34JULOWPf5yk1NvjXgeNJFB6yENfcX	bb588213-144d-48b0-a4e6-f510507cdd48	camera	5_1735711603449542000.png	2025-01-01 12:36:43.547088+06:30	2025-01-01 13:00:18.030793+06:30	2025-01-01 12:36:43.495871+06:30	2025-01-01 13:00:18.037248+06:30
19	5	Stream 14	ok	ended	xtgoWdiGsDUULT7YeIrsNmSVuXnJ6tdnTwE7aHlFtSntlKSn	664f30dd-bfdc-4e8c-b3ac-c4783b011440	camera	5_1735657413635987000.png	2024-12-31 21:33:33.693404+06:30	2024-12-31 21:53:05.360864+06:30	2024-12-31 21:33:33.667288+06:30	2024-12-31 21:53:05.366936+06:30
20	5	Stream 10	ok	ended	VmEzYeOfZlREEFtgiKfapenq5ok7ShIbvmRcHL8oQZ0CXpCU	e6ce6a7f-d8d7-45f9-b191-2d775afe6f66	camera	5_1735708816518838000.png	2025-01-01 11:50:16.634129+06:30	2025-01-01 11:53:09.022354+06:30	2025-01-01 11:50:16.579327+06:30	2025-01-01 11:53:09.026273+06:30
24	5	Stream 18	ok	ended	LNCGt1yIY4bV2y3oNMLlZJC9B28AILCy4pi2fIvKhazVazi2	ec66f674-2fcc-4d34-a496-8614e3bcb6b6	camera	5_1735713357565803000.png	2025-01-01 13:05:57.648192+06:30	2025-01-01 13:06:06.974458+06:30	2025-01-01 13:05:57.607491+06:30	2025-01-01 13:06:06.975763+06:30
34	5	Stream 25	ok	pending	iMlRo2B2ETcPjUASxd5tgQkn0UwViuajKqV5C4M4me2JISpn	c9d42c8b-2562-474f-8945-b7cc7ea92dce	camera	5_1735718037175463000.png	\N	\N	2025-01-01 14:23:57.228371+06:30	2025-01-01 14:23:57.228371+06:30
25	5	Stream 19	ok	ended	bOwNywiAxO8oSMzMOEALHhWoq2Ei6Utl9EKapnuGYhvMwI2d	27d2317d-8de1-4922-8177-d020b7c526c4	camera	5_1735713429343675000.png	2025-01-01 13:07:09.410368+06:30	2025-01-01 13:08:02.460128+06:30	2025-01-01 13:07:09.363661+06:30	2025-01-01 13:08:02.472161+06:30
30	5	Stream 22	ok	ended	ezI6zEzoDzjuWogIogJP7wiykeEnWBTHTNu6tBYgbKiMlKQp	5698e6f1-01c2-405f-ac1b-9f718dc635d6	camera	5_1735716838224426000.png	2025-01-01 14:03:58.303858+06:30	2025-01-01 14:12:15.575264+06:30	2025-01-01 14:03:58.264076+06:30	2025-01-01 14:12:15.581843+06:30
26	5	Stream 20	ok	ended	5zN72aWZpZlAeH5e1zdT98PV0Ab27NLgOkHfaY6Kbc0nwldu	e181651e-86f6-4f6b-a035-5f15930ef3cc	camera	5_1735713563976115000.png	2025-01-01 13:09:24.067911+06:30	2025-01-01 13:09:28.145972+06:30	2025-01-01 13:09:24.039088+06:30	2025-01-01 13:09:28.146572+06:30
37	5	Stream 27	ok	ended	1C91DAtlGcU9ly4lThIpTvpHaOU9Cwprv5YHTMsEjisv6D1b	01c54169-04be-457f-a0a3-4444dc22ed5b	camera	5_1735719327229581000.png	2025-01-01 14:45:27.311186+06:30	2025-01-01 15:18:09.972446+06:30	2025-01-01 14:45:27.257039+06:30	2025-01-01 15:18:09.980475+06:30
31	5	Stream 23	okay	ended	C7PzGyGk76RjZ5safXCqD8qSvFyfq7WoI5jG6BJno2wg21Kc	6d90f737-32fd-4a7a-b5eb-ce42df18d2d4	camera	5_1735717377803697000.png	2025-01-01 14:12:57.855531+06:30	2025-01-01 14:17:10.124893+06:30	2025-01-01 14:12:57.834823+06:30	2025-01-01 14:17:10.12697+06:30
32	5	Stream 24	ok	pending	eDcKyzpfDAEFfk7kjND1t3JnDNV1aCgxtTKBNjraZJYjX4IX	59a77c39-5aca-4805-8acb-21552ebd2f99	camera	5_1735717677976128000.png	\N	\N	2025-01-01 14:17:58.017389+06:30	2025-01-01 14:17:58.017389+06:30
35	5	Stream 25	ok	ended	P73ty5elJ01LSteyBk7BkpwRBCnJJQQDsKpfuTWA30KTzHuD	82ad6bed-c924-4263-ae2d-3e8160ea69b4	camera	5_1735718069420891000.png	2025-01-01 14:24:29.488422+06:30	2025-01-01 14:39:48.834141+06:30	2025-01-01 14:24:29.446278+06:30	2025-01-01 14:39:48.848173+06:30
33	5	Stream 24	ok	ended	gYSwdJR33FZl2FL4DY0hZldzTbEvzvFkbLXOup6IXnDbMtX7	9e7720cb-48e4-4ef9-8eec-571162ce1189	camera	5_1735717724956261000.png	2025-01-01 14:18:44.995598+06:30	2025-01-01 14:23:11.863003+06:30	2025-01-01 14:18:44.970931+06:30	2025-01-01 14:23:11.881994+06:30
36	5	Stream 26	ok	pending	hOHYXwk65XD0ahucehLEwQWEgEhvD3DaVjgcmWZKVEzdzmoA	981d6613-c375-4c79-983a-2456fe2c502b	camera	5_1735719022555552000.png	\N	\N	2025-01-01 14:40:22.577411+06:30	2025-01-01 14:40:22.577411+06:30
40	5	Stream 30	okay	pending	VXxd16XhSRRpNpNOmKZF0PK0Psg9pssKirVjCycSsKtdWmFP	dd618a36-960c-4e40-8895-d329b59c0931	camera	5_1735724181308291000.png	\N	\N	2025-01-01 16:06:21.368943+06:30	2025-01-01 16:06:21.368943+06:30
38	5	Stream 28	Okay	pending	9VtQHVWJTQcwuJLiaocC5q0zkK1kNAVcI2FG0bSmFlv84vN6	9640a207-8ef8-4385-a67d-1eb9599bac65	camera	5_1735722314361533000.png	\N	\N	2025-01-01 15:35:14.388548+06:30	2025-01-01 15:35:14.388548+06:30
39	5	Stream 29	Okay	ended	Wwi1pPsQEz8t8GChcU3TPLyxNs6MJ5EEWPqSoVQLXNvHzVJ2	b356083b-111e-4ee3-85f1-87ae59686141	camera	5_1735722363525339000.png	2025-01-01 15:36:03.583296+06:30	2025-01-01 16:05:52.275927+06:30	2025-01-01 15:36:03.543052+06:30	2025-01-01 16:05:52.281008+06:30
41	5	Stream 31	aoky	ended	mtnBuxEOjlcgM5TvcYZEZEoUQ3mp6aKUuRvfdhLftmpYdH6u	33de99a2-4018-4987-a1fe-0c7831ba3285	camera	5_1735724211238050000.png	2025-01-01 16:06:51.33513+06:30	2025-01-01 16:08:36.8388+06:30	2025-01-01 16:06:51.263292+06:30	2025-01-01 16:08:36.841247+06:30
42	5	Stream Test 1	okay	ended	4rucPsiXk9IgWeDFDH6Dhh5i8lUcd8fiqTvzySlm5NTwI0TC	2123742d-d001-4036-93d5-ec7c658a865b	camera	5_1735724677223388000.png	2025-01-01 16:14:37.281903+06:30	2025-01-01 16:15:49.753812+06:30	2025-01-01 16:14:37.247929+06:30	2025-01-01 16:15:49.768632+06:30
43	5	Stream Test 2	Okay	ended	rqqBxRY0gnVy8CZJUN6hZuVnHAKmgJVnmpcIYPGE5HXctdLj	9f7416ed-e2f8-4c4b-90db-12940a041c8a	camera	5_1735725350784890000.png	2025-01-01 16:25:50.844985+06:30	2025-01-01 16:26:00.107594+06:30	2025-01-01 16:25:50.817633+06:30	2025-01-01 16:26:00.108761+06:30
53	5	Stream Test after refactor 3	okay	ended	xY0RUlgQOiYoos8JVCuRobERT1VVCYQmq8AbVm8MVFoyBmFF	b2c4ba52-c6fd-4913-9a59-556e0d1088b1	camera	5_1735803344888422000.png	2025-01-02 14:05:44.962459+06:30	2025-01-02 14:06:24.847571+06:30	2025-01-02 14:05:44.933605+06:30	2025-01-02 14:06:24.848561+06:30
44	5	Stream Test 3	okay	ended	qhaukxDjS6tLGvR5pewEsDmGykCMcLUI4sJ4QUXxTP6yDhm4	7547d8b8-4164-4646-b73a-17c31d6d13dd	camera	5_1735725409075552000.png	2025-01-01 16:26:49.120904+06:30	2025-01-01 16:27:27.667923+06:30	2025-01-01 16:26:49.091747+06:30	2025-01-01 16:27:27.687225+06:30
45	5	Stream Test 4	okay	ended	LOw46HkMpOE4nEEkcirguBmFMvd78roHbeTw18eXja2sA1IB	fe8cc4e4-b243-4d81-8469-4eb4baf0ec77	camera	5_1735725545300913000.png	2025-01-01 16:29:05.352462+06:30	2025-01-01 16:30:06.306945+06:30	2025-01-01 16:29:05.331291+06:30	2025-01-01 16:30:06.308038+06:30
60	5	Title	ok	ended	Rm0RDuPt8NqViPyzMIxNmgvoIP1EWVHPTJ9EwQdHWOh3yKJI	8c7b254c-c759-4a78-8ce2-5b923a8f0119	pre_record	5_1736165782094135000.jpeg	2025-01-08 21:02:35.951999+06:30	2025-01-08 21:02:36.615457+06:30	2025-01-06 18:46:22.115813+06:30	2025-01-08 21:02:36.616378+06:30
46	5	Refactor Test Watch Live	ok	ended	jYSPccROOWgpizZVGL96yKAV6kKu2buuMyEoLN5FA0VeHILn	65c327ce-458a-4a0b-b854-cd124918ba36	camera	5_1735738716643497000.png	2025-01-01 20:08:36.76964+06:30	2025-01-01 20:09:00.707557+06:30	2025-01-01 20:08:36.711214+06:30	2025-01-01 20:09:00.714001+06:30
54	5	Stream test	ok	ended	edf48M6GQMXFeyWF769ntA23mNCagHn5malJ2XjUqjIKj6r1	5d0caa7d-1938-425c-b3ba-8b0c2ea3bd08	camera	5_1735820869327968000.png	2025-01-02 18:57:49.47901+06:30	2025-01-02 18:58:04.616588+06:30	2025-01-02 18:57:49.37442+06:30	2025-01-02 18:58:04.618674+06:30
47	5	Refactor Test Live 2	ok	ended	5KRY3w6nxDG5q92mcU64ONBxgxVELiLSqf6xnvVuhwLAMQsn	4145facb-ebea-49f9-ab30-53233fe0747f	camera	5_1735738800199664000.png	2025-01-01 20:10:00.230728+06:30	2025-01-01 20:10:57.961044+06:30	2025-01-01 20:10:00.211741+06:30	2025-01-01 20:10:57.963723+06:30
48	5	Refactor 3	ok	ended	7OIkdQrZLXI1fkL4UIfThVBCsmobqH3Hyy1VcRtItvI65LqN	aaef64e9-7089-4fe4-a15a-e97b0cde93bb	camera	5_1735739063459712000.png	2025-01-01 20:14:23.539988+06:30	2025-01-01 20:15:10.321573+06:30	2025-01-01 20:14:23.497591+06:30	2025-01-01 20:15:10.401675+06:30
49	5	Refactor 3	ok	ended	mx3ut82q5Zds7YhwI9EccExXoJ7qTQi4HVJwpQkl3N3uSpkt	a75dbddf-3168-48da-9adc-8148d516ea85	camera	5_1735740141347229000.png	2025-01-01 20:32:21.429598+06:30	2025-01-01 20:32:48.930289+06:30	2025-01-01 20:32:21.388048+06:30	2025-01-01 20:32:48.932009+06:30
55	5	Stream ok	ok	ended	IiUEorO2BXp6UxayD8sxoenmy5QN5ahGPhZ3oKoR63EcrW29	35098e31-06a2-4071-9ab2-08836933b60d	camera	5_1735820912260647000.png	2025-01-02 18:58:32.301371+06:30	2025-01-02 18:58:45.431062+06:30	2025-01-02 18:58:32.280915+06:30	2025-01-02 18:58:45.436328+06:30
50	5	Chat toast	ok	ended	NPqFUwZIrUWP5KycAd44dIIdc4qAWesPzkmsCR12EIRuui07	789ce93b-dbee-46c0-9741-663586725236	camera	5_1735740977359002000.png	2025-01-01 20:46:17.463054+06:30	2025-01-01 20:46:48.091666+06:30	2025-01-01 20:46:17.414625+06:30	2025-01-01 20:46:48.19642+06:30
51	5	Stream Test after refactor 1	ok	ended	sJ0WNTW3UJaCwVPhJssWMqaCHAeNmjUHZ9Qto4glzXChK4Pv	53e08692-e0ad-4543-b846-c1f53262922f	camera	5_1735800753352135000.png	2025-01-02 13:22:33.532958+06:30	2025-01-02 13:23:16.479902+06:30	2025-01-02 13:22:33.425561+06:30	2025-01-02 13:23:16.481314+06:30
68	5	Hello 	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gall Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gall Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gall	ended	PWfRfB0Fmx7IGOgswd8HQozq0lYQSYinp2eAspYFxxnbIwaT	8444a8e8-e2d4-4a0b-94a3-44fe8a992f4e	camera	5_1736407629371766000.png	2025-01-09 13:57:09.48845+06:30	2025-01-09 13:57:33.776999+06:30	2025-01-09 13:57:09.42065+06:30	2025-01-09 13:57:33.88207+06:30
52	5	Stream Test after refactor 2	Okay	ended	zcJHVtsjIx06sk0fsa0vY9mlbmRFyiSowKQnfNGP6WV7Ogu2	7e1c0298-e1b5-4759-bffb-ca9f58fafd87	camera	5_1735802881126725000.png	2025-01-02 13:58:01.240867+06:30	2025-01-02 13:58:59.443706+06:30	2025-01-02 13:58:01.17836+06:30	2025-01-02 13:58:59.451277+06:30
56	5	stream test	okay	ended	9LNY7w4cQ42UOh1lcT6HRPBqLgtRUXURlTx6CmcewG9M0CgO	9bd414c6-7556-4c24-a269-18e4c4eea094	camera	5_1735821346065861000.png	2025-01-02 19:05:46.144727+06:30	2025-01-02 19:05:55.638539+06:30	2025-01-02 19:05:46.097312+06:30	2025-01-02 19:05:55.738438+06:30
62	5	Okay	here	ended	gsmOadztluZ2J7yyfUfbqPgUfpxLzpgCTf0VqgRovojrxYeQ	6d8bd559-7191-4519-8420-3fc9e622772a	camera	5_1736347642402870000.png	2025-01-08 21:17:22.524575+06:30	2025-01-08 21:20:12.564447+06:30	2025-01-08 21:17:22.461868+06:30	2025-01-08 21:20:12.566648+06:30
57	5	stream	ok	ended	exWnQBbRfGR7rofrn48uqUNZqefXf6RhzDedXjfTgWmSncfJ	61d1d22a-e5f0-4c97-8cb4-ce047ab59789	camera	5_1735821474091610000.png	2025-01-02 19:07:54.174978+06:30	2025-01-02 19:08:05.659042+06:30	2025-01-02 19:07:54.114279+06:30	2025-01-02 19:08:05.667483+06:30
58	5	hello	ok	ended	nmt4SvvBf9aWmIlHfgPf1xgKTKT0u3nJIL96vE6OkukmnzKP	109df91a-db03-4f9c-aaf0-7b28bb8cf476	camera	5_1735821567195207000.png	2025-01-02 19:09:27.925638+06:30	2025-01-02 19:09:41.131844+06:30	2025-01-02 19:09:27.533837+06:30	2025-01-02 19:09:41.151509+06:30
61	5	hi	okd	ended	qqq3YRvYPA18CBodDEVyq01lqLl3Q5vFdac9hIEkKukerkuU	ff9e1bd6-716a-46de-a371-ef32f56999f5	pre_record	5_1736166086889340000.png	2025-01-08 22:34:44.902028+06:30	2025-01-08 22:34:45.212678+06:30	2025-01-06 18:51:26.929423+06:30	2025-01-08 22:34:45.21363+06:30
59	5	Stream 202 test	ok	ended	ZkOWiYA9e899CeVxh8zZkaebfW3hU19isGfuAEFMiYfDARfu	cb13d13e-d126-41a8-85d8-9a600e9e8b42	camera	5_1735822603462479000.png	2025-01-02 19:26:43.567107+06:30	2025-01-02 19:27:24.559873+06:30	2025-01-02 19:26:43.521341+06:30	2025-01-02 19:27:24.56447+06:30
70	5	Hello	okok	ended	plBz1FCW39oHjpkp35oQniglJTMKafcjEB23ZRgsE1p7cJUx	5ee52a52-724a-4acd-9835-b0d1e20e0cba	camera	5_1736410702653338000.png	2025-01-09 14:48:22.753977+06:30	2025-01-09 14:58:13.832144+06:30	2025-01-09 14:48:22.695293+06:30	2025-01-09 14:58:13.836376+06:30
63	5	Hello this is gonna be updated later	ok 1	ended	LUrGrY6xPxGM28TMDNdhM2kzycMrI4gwUCgl8edVJjuIOGRP	36677f46-030e-47e7-9a75-332b0f51e2fe	camera	5_1736399674787159000.png	2025-01-09 11:44:34.904689+06:30	2025-01-09 12:10:11.587719+06:30	2025-01-09 11:44:34.828641+06:30	2025-01-09 12:10:11.591614+06:30
64	5	Hi	holla	ended	jgO8j1XWQnREqGLVUMfyEeMPe5jTbpz6VVtiwbpM7xRfKR5b	4442d5aa-49fa-4f98-98f2-7d7ea3107c77	camera	5_1736403715740510000.png	2025-01-09 12:51:55.865779+06:30	2025-01-09 13:06:45.372734+06:30	2025-01-09 12:51:55.804368+06:30	2025-01-09 13:06:45.38248+06:30
74	5	Hello create	ok	ended	jgae8WoFvyRj4yNWMuLiyDL13q4KG1Kk1Y7bOiF9LtPBfyMv	9191d216-bd54-46e5-8049-a79fe232100f	camera	5_1736415525364240000.png	2025-01-09 16:08:45.48281+06:30	2025-01-09 16:39:07.293221+06:30	2025-01-09 16:08:45.427105+06:30	2025-01-09 16:39:07.303069+06:30
73	5	Okhaha	adkjaflksdjf	ended	bDyxWIcl9cNP65sMCiyYiHhr8dJdZCIQ5NoHyYzWm9dEZ1iv	78f67660-3913-4731-9b59-360bf01664e8	camera	5_1736413617133239000.png	2025-01-09 15:36:57.200111+06:30	2025-01-09 15:37:42.268761+06:30	2025-01-09 15:36:57.142366+06:30	2025-01-09 15:37:42.28703+06:30
99	5	Stream udpate test 101 9999	ok dedede 101 9999	ended	5XU4DxpzR3cM8Kw3vlU0baFBE8u73ssB85MmttdiDwmeevig	56618aac-11da-45a4-afc1-c7a84a475e59	camera	1736438550632467000.png	2025-01-09 22:31:16.952393+06:30	2025-01-09 22:32:59.711974+06:30	2025-01-09 22:31:16.907772+06:30	2025-01-09 22:32:59.712994+06:30
65	5	Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  \r\nIt is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors	ended	XcpET3BVrXhqwo9rvxKJrmAiWrKTiFvR3eDsTy0A6g4NMwRP	ea37479e-9460-4eba-b9f6-f8503b6c1e72	camera	5_1736404682190472000.png	2025-01-09 13:08:02.24887+06:30	2025-01-09 13:09:21.227445+06:30	2025-01-09 13:08:02.22771+06:30	2025-01-09 13:09:21.232986+06:30
66	5	abc	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gall Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gall Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gall Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a ga.	ended	yN841H2Nqkd8xHSfYw4Fei4NT56YmhIHt8oKdj5oE63l8Xtl	5c1030cb-6bbd-4b1c-9fad-8d4ab3d90b3f	camera	5_1736404957343196000.png	2025-01-09 13:12:37.395883+06:30	2025-01-09 13:16:26.851449+06:30	2025-01-09 13:12:37.369345+06:30	2025-01-09 13:16:26.857443+06:30
86	5	okok 1	okok 1	ended	sGqmNZljL2dCpdvr1LVeGBwQK1AdamMKMQ05cmhHghoATAz9	46086980-8ec7-4291-9d9b-215e91f5baae	camera	5_1736419204521722000.png	2025-01-09 17:10:04.576693+06:30	2025-01-09 17:13:30.515386+06:30	2025-01-09 17:10:04.550409+06:30	2025-01-09 17:13:30.520515+06:30
67	5	Okay	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gall Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gall Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gall Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a ga. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gall Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gall Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gall Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a ga.	ended	sp3MJKwB1QAtPWvIxZF9C7LZ3HV3ItOj8sA3g3gzcLgFmozk	9ebd822d-1507-4f6f-8aab-e8b5386ea600	camera	5_1736405254769487000.png	2025-01-09 13:17:34.875226+06:30	2025-01-09 13:18:38.759395+06:30	2025-01-09 13:17:34.829253+06:30	2025-01-09 13:18:38.784236+06:30
77	5	Hello Create Update now	Ok create update	pending	q9zlDNvO6W9hPfVO9emkwxzneHo5pWsd0cd0gTi0b9ETYKGz	e6ed25bf-b453-4ba2-a8b8-b75ccb57fe67	camera	5_1736417488567159000.png	\N	\N	2025-01-09 16:41:28.575217+06:30	2025-01-09 16:41:28.575217+06:30
69	5	Hi	ok	ended	nLdA6NfXLtB7dARqRpm1dLgIdk6mgJmvbwRLpAruhWhu62g3	6b2546db-0c36-4007-9580-b76a70ca2794	camera	5_1736410015532909000.png	2025-01-09 14:36:55.642053+06:30	2025-01-09 14:48:04.27217+06:30	2025-01-09 14:36:55.581085+06:30	2025-01-09 14:48:04.286292+06:30
76	5	Hello Create	Ok create	ended	JOLITAwUAijM0OYUoQsnQjtwNVzBfccURRk2jxPLesf3xD09	3921b108-321e-47bd-ba20-a8fe6d9ceb3a	camera	5_1736417440017313000.png	2025-01-09 16:40:40.077009+06:30	2025-01-09 16:41:37.097058+06:30	2025-01-09 16:40:40.046586+06:30	2025-01-09 16:41:37.113772+06:30
71	5	okok	haha	ended	muXgp1b42ewSChwcvwUgByPCNVSBsWByCF1fd3KECBlg8o0z	d5e87cd2-2e8c-4c34-afb8-f31ceb49ff02	camera	5_1736411340216840000.png	2025-01-09 14:59:00.338316+06:30	2025-01-09 15:34:04.011857+06:30	2025-01-09 14:59:00.2742+06:30	2025-01-09 15:34:04.043681+06:30
72	5	Ok Ok	thumbnail 3	ended	AXNTt7UOFepkYtcw3wP4WIXcxSur8ZNpXhfHejNa2rX68C2E	f81efb2d-4eea-4a8a-a7bb-50ec4884e0c0	camera	5_1736413483412487000.png	2025-01-09 15:34:43.512985+06:30	2025-01-09 15:40:49.396473+06:30	2025-01-09 15:34:43.451762+06:30	2025-01-09 15:40:49.724457+06:30
75	5	Hello create updated	ok updated	pending	e5wKS1HETOJei2OQjioVA93nIzhTZ79bOn6bU0qXt8y6td90	19676ca8-3a8a-499a-9a2e-c360922cc26e	camera	5_1736416577557648000.png	\N	\N	2025-01-09 16:26:17.60009+06:30	2025-01-09 16:26:17.60009+06:30
79	5	Hi c u	c u	pending	9psUuLDvdKWhc4lfeQbnX2JrgDzRIXc2X1vje2VUJl9Me63A	11e16891-51eb-4de0-a68e-e390d99f6c1f	camera	5_1736417595956810000.png	\N	\N	2025-01-09 16:43:15.964633+06:30	2025-01-09 16:43:15.964633+06:30
78	5	Hi c	c	ended	Ufzpb20oI7Xcgsd4VW1aBTt7tO80ZLbNeRuo9iD2wjwmJDNw	7ed3c4aa-e246-4ba1-87d7-52db738a5074	camera	5_1736417554750210000.png	2025-01-09 16:42:34.789844+06:30	2025-01-09 16:43:51.539265+06:30	2025-01-09 16:42:34.766893+06:30	2025-01-09 16:43:51.548461+06:30
89	5	Hi 1	hi 1	ended	SfU8k81LTNJnpAsov0InzuVlpSQZYsderw52WgJNYkMhN3Gh	568b25be-7e00-415f-a2e8-2dd29a2acc62	camera	5_1736421332782416000.png	2025-01-09 17:45:32.844279+06:30	2025-01-09 17:47:56.052267+06:30	2025-01-09 17:45:32.815651+06:30	2025-01-09 17:47:56.064168+06:30
81	5	Hi create updated	create updated	pending	sAAkPS9le3P3yyew6PQ58buO0PvcdfoYboak8O6DqH84JKnF	083d3327-bf8d-453d-985b-414ecf17e221	camera	5_1736418373685957000.png	\N	\N	2025-01-09 16:56:13.704243+06:30	2025-01-09 16:56:13.704243+06:30
82	5	Hi create updated wow	create updated wow	pending	Mxjo0fEz4GPPCHu7P3M1aY4NVPMJaDHRm8eL1lsfJbTy371Q	ae48f910-6961-40d0-92c3-351843e496df	camera	5_1736418518437136000.png	\N	\N	2025-01-09 16:58:38.457307+06:30	2025-01-09 16:58:38.457307+06:30
83	5	Hi create updated wowdd	create updated wowdd	pending	I2PgSqMyMVjHUMA32WfQ7vpqElRiuUN3NEakphGXZtq4hfu2	62cb1bcc-a6ba-47ac-ad78-6330cba70f63	camera	5_1736418625763790000.png	\N	\N	2025-01-09 17:00:25.793623+06:30	2025-01-09 17:00:25.793623+06:30
80	5	Hi create	create	ended	OwAfTIVoxyzdwEBUNuo12diKjPPXrxaT5XCEcSwb3v8UYw9j	93395f08-c04b-467c-a9e9-aca15773e204	camera	5_1736418335599785000.png	2025-01-09 16:55:35.685391+06:30	2025-01-09 17:03:53.153149+06:30	2025-01-09 16:55:35.637807+06:30	2025-01-09 17:03:53.161981+06:30
84	5	okok create	okok create	ended	D0wSXNHjSmO6IHxEMmdLfoy5KwIC0cTgEcCcSBGfRUgOXWGE	992d8c87-31fd-4d0e-8927-edb56d3a1dd1	camera	5_1736418853867343000.png	2025-01-09 17:04:13.952966+06:30	2025-01-09 17:05:01.868019+06:30	2025-01-09 17:04:13.916586+06:30	2025-01-09 17:05:01.869972+06:30
87	5	hi create 	hi create	ended	jBgad0HfrZvLiim88upJC9dBSfGwkUQOD8M6HxvFUPIXVfdq	fad1a7d7-c1fa-445d-8ce0-04458705ad5b	camera	5_1736419436061417000.png	2025-01-09 17:13:56.100883+06:30	2025-01-09 17:15:15.393905+06:30	2025-01-09 17:13:56.078936+06:30	2025-01-09 17:15:15.398361+06:30
85	5	apple 1	apple 1	ended	n8bpOghX67JM78j1Ydp03C0JeuPSGl6onPYXjuiHZkGw8uar	a45e0eb0-d955-4d7e-90df-e14867b4aac5	camera	5_1736418958486511000.png	2025-01-09 17:05:58.552539+06:30	2025-01-09 17:08:19.781873+06:30	2025-01-09 17:05:58.526847+06:30	2025-01-09 17:08:19.830145+06:30
92	5	Hi 1	hi 1	ended	fKynJoilakt3qK0gohJuIDysJ4ceLr9teyjdJ0jK4mvzMIBe	ef4179f0-ca5d-4682-89ed-276adf534f6d	camera	5_1736425259515559000.png	2025-01-09 18:50:59.854484+06:30	2025-01-09 19:07:49.837746+06:30	2025-01-09 18:50:59.722776+06:30	2025-01-09 19:07:49.844842+06:30
91	5	orange	orange	ended	iFJhrc1ulv3eQzxh5JfXscOwDqTPXFNlJT7OltjXMzOpABSx	0846db07-773d-45f9-8cd7-fe6f95657aa7	camera	5_1736422081263868000.png	2025-01-09 17:58:01.346149+06:30	2025-01-09 18:50:13.250516+06:30	2025-01-09 17:58:01.306453+06:30	2025-01-09 18:50:13.25504+06:30
88	5	create test	ok	ended	v1Gp8V1wA0Txhn4fcVVzoYQZURNeDDEpPlc9AXjqtDPVWHYJ	02c3663e-6b21-40c6-92b5-05e87830c5cb	camera	5_1736421210015966000.png	2025-01-09 17:43:30.08707+06:30	2025-01-09 17:45:13.690936+06:30	2025-01-09 17:43:30.040416+06:30	2025-01-09 17:45:13.724341+06:30
94	5	Hi test 200	test 200	ended	QOhvvuU3QOkHGuX524aSviPX2txc2uENUwCjXPb5LN7qpiPa	183733ff-e89b-4d3b-b1ae-07f232c4dfd8	camera	5_1736426781861035000.png	2025-01-09 19:16:21.96035+06:30	2025-01-09 19:18:03.758346+06:30	2025-01-09 19:16:21.903561+06:30	2025-01-09 19:18:03.764039+06:30
90	5	ok 100	desc 100	ended	xbbgltNoyIgirctG45pOa6Jr57NOvdsWq1UVsAVg61pvh1Km	7ecc6fde-b698-4d7c-b2ce-dd721120e98e	camera	5_1736421771380369000.png	2025-01-09 17:52:51.447146+06:30	2025-01-09 17:56:59.860771+06:30	2025-01-09 17:52:51.404551+06:30	2025-01-09 17:56:59.865971+06:30
93	5	create 	create	ended	JPzsWKy7anxIST4sBHQ0Mvi6mBjDQQK1XLIHmbVZMgRnenwj	0c5ea3d2-6bc8-4190-8c2a-c48f32ae28f9	camera	5_1736426590660060000.png	2025-01-09 19:13:10.761074+06:30	2025-01-09 19:14:37.288309+06:30	2025-01-09 19:13:10.72202+06:30	2025-01-09 19:14:37.329385+06:30
95	5	stream update testo	ok	ended	oZU16oSFO7IwFpu7jHXODF9zQs5JsmmH2yTLE8SEGZKxNksf	e9604990-9ec2-4920-9a0f-7146e38083c0	camera	5_1736431178877701000.png	2025-01-09 20:29:38.990885+06:30	2025-01-09 20:31:04.181819+06:30	2025-01-09 20:29:38.933752+06:30	2025-01-09 20:31:04.184252+06:30
96	5	Hi stream orange	ok	ended	We9YMCsSsDFbCidpRcYoUaO9f76STYbJjqbublrfXkVXLyoa	da5b2440-4feb-4a44-8a4d-424c2ba2963b	camera	5_1736431965753085000.png	2025-01-09 20:42:45.86516+06:30	2025-01-09 20:43:19.199051+06:30	2025-01-09 20:42:45.816955+06:30	2025-01-09 20:43:19.203067+06:30
97	5	Hi stream test 101 updated	ok updated ok	ended	UPxlheM7kdkgKwvZRumthg7d50IvpE4TDK45MSt4dk7zH6Qa	a03b6f57-6ac5-4f92-a6eb-f3041ee62208	camera	1736432134853709000.png	2025-01-09 20:44:20.42275+06:30	2025-01-09 20:45:50.007306+06:30	2025-01-09 20:44:20.392031+06:30	2025-01-09 20:45:50.013602+06:30
98	5	hello test 101 102	hello test updated 102	ended	3ugcsQNr4qhfaXL7KFtKzDn6huI6K0Z1nqy60VlokUId3PSJ	54568cba-8897-495f-abfa-c126317dbfc7	camera	1736436617345838000.png	2025-01-09 21:56:05.192797+06:30	2025-01-09 22:00:23.841054+06:30	2025-01-09 21:56:05.122409+06:30	2025-01-09 22:00:23.844574+06:30
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, subscriber_id, streamer_id, created_at) FROM stdin;
3	2	5	2025-01-07 15:04:27.308862+06:30
4	2	6	2025-01-07 15:04:27.308862+06:30
5	2	7	2025-01-07 15:04:27.308862+06:30
6	2	8	2025-01-07 15:04:27.308862+06:30
8	2	10	2025-01-07 15:04:27.308862+06:30
9	2	11	2025-01-07 15:04:27.308862+06:30
10	2	12	2025-01-07 15:04:27.308862+06:30
11	2	13	2025-01-07 15:04:27.308862+06:30
12	2	14	2025-01-07 15:04:27.308862+06:30
14	2	16	2025-01-07 15:04:27.308862+06:30
15	2	17	2025-01-07 15:04:27.308862+06:30
18	2	20	2025-01-07 15:04:27.308862+06:30
\.


--
-- Data for Name: two_fas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.two_fas (id, user_id, secret, is2fa_enabled, created_at, updated_at) FROM stdin;
4	5	CGVFWW45OMGFY3RVXAGVZZTWSC3MG6TX	f	2024-12-31 15:54:08.239415+06:30	2024-12-31 15:54:08.239415+06:30
1	2	N5KFY76UCXK3SEAYYUMP2NE4JTU6UDYG	t	2024-12-29 16:06:00.275889+06:30	2025-01-12 16:59:52.983576+06:30
5	25	CO5BKZDSQ7O7FSJCX2MCJ7YHHGXWVQH2	f	2025-01-12 17:05:45.160818+06:30	2025-01-12 17:05:45.160818+06:30
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, display_name, email, password_hash, otp, otp_expires_at, role_id, created_at, created_by_id, updated_at, updated_by_id, deleted_at, deleted_by_id, avatar_file_name) FROM stdin;
1	superAdmin		superAdmin@gmail.com	$2a$14$TRuQxOI4ov59Syyp3LCe..Rmd5jrlg/2HpGD5UjN0yz1n98YKwCj.		\N	1	2024-12-29 15:55:01.191921+06:30	\N	2024-12-29 15:55:01.191921+06:30	\N	\N	\N	\N
19	streamer15	Simran Kaur	streamer15@gmail.com	$2a$14$Nv2CMW/Yn4B0Pjz8cCpbgeoQLw4Uo8dsbL4frhCS7uUi5P.UepZxW		\N	4	2025-01-07 18:38:42.68453+06:30	\N	2025-01-07 18:38:42.68453+06:30	\N	\N	\N	\N
10	streamer6	TheEllenShow	streamer6@gmail.com	$2a$14$bpV/5bbu.TVz0.5YbheKUOVVhVPShy1TKlZlfm/n.kBAMEJyLw/G2		\N	4	2025-01-07 18:37:56.18325+06:30	\N	2025-01-07 18:37:56.18325+06:30	\N	\N	\N	1735479098279182000.jpeg
14	streamer10	Code with Ania Kubow	streamer10@gmail.com	$2a$14$Ic3iXHC8KNWiaY6oY6V5w.EQvqVOnAe1DPtQvfmr6CqF6dqpDMz32		\N	4	2025-01-07 18:38:18.058994+06:30	\N	2025-01-07 18:38:18.058994+06:30	\N	\N	\N	1736104003288072000.png
20	streamer16	GOTO Conferences	streamer16@gmail.com	$2a$14$w3BiwzcDLaSsjEtrZz/ZTOEDq/I7duSiJYDnP5X8oUWlINbGHv5G6		\N	4	2025-01-07 18:38:47.796473+06:30	\N	2025-01-07 18:38:47.796473+06:30	\N	\N	\N	1735479098279182000.jpeg
23	streamr19	Learn English with Chinese101.com	streamer19@gmail.com	$2a$14$avi/OONUTAGAp7UR4Q3SK.DCrRtXqJgwnc1KUljSVaggTdOqH8FoO		\N	4	2025-01-07 18:41:36.325934+06:30	\N	2025-01-07 18:41:36.325934+06:30	\N	\N	\N	\N
12	streamer8	Stripe Developers	streamer8@gmail.com	$2a$14$vRvfDyG04yPykLyNLLLm0uHazcTogQnnrs/DRL5RkjDKiwDY1hOTa		\N	4	2025-01-07 18:38:04.960636+06:30	\N	2025-01-07 18:38:04.960636+06:30	\N	\N	\N	1735479098279182000.jpeg
24	streamr20	GFX OM	streamer20@gmail.com	$2a$14$ZSfcMVtTKwknQhzjuLiMlOCeAn7VaMdf0FWwq2TDc.lfKggfeOrkC		\N	4	2025-01-07 18:41:41.227385+06:30	\N	2025-01-07 18:41:41.227385+06:30	\N	\N	\N	\N
8	streamer4	Maya Lee	streamer4@gmail.com	$2a$14$Kzq5stmEsQYwg4EoVfSMWuKu1hdmek08SEfmb61hoG1pRyN2xYVMi		\N	4	2025-01-07 18:37:48.312549+06:30	\N	2025-01-07 18:37:48.312549+06:30	\N	\N	\N	1735479098279182000.jpeg
16	streamer12	Meta	streamer12@gmail.com	$2a$14$m19mKB4XktP0GeFeNmVUge9s.oaAyjvONHineqQGHO071gmNnLzpG		\N	4	2025-01-07 18:38:28.895826+06:30	\N	2025-01-07 18:38:28.895826+06:30	\N	\N	\N	1735479098279182000.jpeg
2	khukho	Khukhohello	khukho@gmail.com	$2a$14$gyZv8uWcSc0tX/TbreRml.fXNt74JwkDlFPXZlNRFcEU8hxrEHKrq		\N	4	2024-12-29 16:05:53.989909+06:30	\N	2025-01-12 17:01:03.278728+06:30	\N	\N	\N	1736335861482820000.png
25	khukho1	Khukho1	khukho1@gmail.com	$2a$14$JCZp9NH9Z8OjExQiYWSHeeVrjf8Eo3Try8rY3scR9CqEVEDU3qlaW		\N	4	2025-01-12 17:05:32.594152+06:30	\N	2025-01-12 17:05:32.594152+06:30	\N	\N	\N	\N
21	streamer17	IAmTimCorey	streamer17@gmail.com	$2a$14$IwgTH1nIrdRuNo54xAw82umDlEU1bcNuLglQcFfdLNDE2simFNk/S		\N	4	2025-01-07 18:41:24.903481+06:30	\N	2025-01-07 18:41:24.903481+06:30	\N	\N	\N	1736104003288072000.png
17	streamer13	Microsoft	streamer13@gmail.com	$2a$14$fjCkNARVObcLxNv/XO0zuuLb7bGJwyhkb6T9z6gQNasRhcYeJMToK		\N	4	2025-01-07 18:38:33.690604+06:30	\N	2025-01-07 18:38:33.690604+06:30	\N	\N	\N	\N
6	streamer2	IBM Technology	streamer2@gmail.com	$2a$14$xtlQlL8SvUtspfzLmW4DEe/qFRAZSIO.CQQvW6B4t7DrOWQBKQKU2		\N	4	2025-01-07 18:35:32.429921+06:30	\N	2025-01-07 18:35:32.429921+06:30	\N	\N	\N	1736104003288072000.png
9	streamer5	Gordon Ramasay	streamer5@gmail.com	$2a$14$JtQ4BDBdTQlkcMUXIB8Hpe8wrp0lKlS5a2hW.1XVeNgVWlM7pTHNe		\N	4	2025-01-07 18:37:52.350319+06:30	\N	2025-01-07 18:37:52.350319+06:30	\N	\N	\N	1736104003288072000.png
13	streamer9	Jack Herrington	streamer9@gmail.com	$2a$14$50y2mlcOslXwPGq1u5fdlOMUjmKekZqCw3q64FBKJzQb5x2I7q9aK		\N	4	2025-01-07 18:38:10.016283+06:30	\N	2025-01-07 18:38:10.016283+06:30	\N	\N	\N	\N
7	streamer3	Apple	streamer3@gmail.com	$2a$14$KiKo0c7lN5HCDUCx9Cb1m.YuoQUziQ59emi7OwQbGoQtA8c6LvhWy		\N	4	2025-01-07 18:37:40.238712+06:30	\N	2025-01-07 18:37:40.238712+06:30	\N	\N	\N	\N
11	streamer7	Adobe Video & Motion	streamer7@gmail.com	$2a$14$m8cXO7qgonKnNR6WmoNRDOFrbeWCTI4F2ND18cChUHcXQUoapVmBS		\N	4	2025-01-07 18:38:00.425517+06:30	\N	2025-01-07 18:38:00.425517+06:30	\N	\N	\N	\N
18	streamer14	OpenAI	streamer14@gmail.com	$2a$14$GGQ1/30A61xnvuvvvfiNUevUmkKtkvXIK123jNfVKqt9mXjkw4Pz6		\N	4	2025-01-07 18:38:38.201309+06:30	\N	2025-01-07 18:38:38.201309+06:30	\N	\N	\N	1736104003288072000.png
15	streamer11	Max Tech	streamer11@gmail.com	$2a$14$RcAI8Uf5Q6k/RuDJgcpheu0HATcXhgFEWFaH5Y7zMQShEtR0qHoK6		\N	4	2025-01-07 18:38:24.313395+06:30	\N	2025-01-07 18:38:24.313395+06:30	\N	\N	\N	\N
22	streamr18	Dumenicus	streamer18@gmail.com	$2a$14$sjs5DculxN0.QRCnxDW5duv8ejSpUT0BnSP7B94LfmhTw31qQ9EAe		\N	4	2025-01-07 18:41:32.211038+06:30	\N	2025-01-07 18:41:32.211038+06:30	\N	\N	\N	\N
5	streamer1	Amy Landino	streamer1@gmail.com	$2a$14$OHsdCAgv2o/gFw2ONa/EsOJeBtz7b7sDcoFrXKfQmXOytWzd7mIL2		\N	3	2024-12-29 16:05:53.989909+06:30	\N	2025-01-06 01:36:43.294257+06:30	\N	\N	\N	1736104003288072000.png
\.


--
-- Data for Name: views; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.views (id, user_id, stream_id, view_type, is_viewing, created_at, updated_at) FROM stdin;
22	5	20	live_view	f	2025-01-01 11:50:16.696267+06:30	2025-01-01 11:53:09.014289+06:30
35	1	31	live_view	f	2025-01-01 14:13:04.472979+06:30	2025-01-01 14:18:05.258969+06:30
34	5	31	live_view	f	2025-01-01 14:12:57.880663+06:30	2025-01-01 14:18:10.901871+06:30
23	5	21	live_view	f	2025-01-01 11:54:59.105069+06:30	2025-01-01 12:00:48.267608+06:30
24	5	22	live_view	f	2025-01-01 12:02:47.171265+06:30	2025-01-01 12:11:04.121937+06:30
69	5	56	live_view	f	2025-01-02 19:05:46.178639+06:30	2025-01-02 19:05:55.74167+06:30
53	5	46	live_view	f	2025-01-01 20:08:36.831849+06:30	2025-01-01 20:09:18.544112+06:30
37	1	33	live_view	f	2025-01-01 14:19:01.842609+06:30	2025-01-01 14:24:05.240173+06:30
36	5	33	live_view	f	2025-01-01 14:18:45.032885+06:30	2025-01-01 14:24:05.240225+06:30
25	5	23	live_view	f	2025-01-01 12:36:43.600076+06:30	2025-01-01 13:00:18.031102+06:30
9	5	7	live_view	f	2024-12-31 14:46:43.37486+06:30	2024-12-31 14:46:51.955361+06:30
11	2	8	record_view	f	2024-12-31 16:18:25.158582+06:30	2024-12-31 16:18:25.158582+06:30
10	5	8	live_view	f	2024-12-31 16:09:57.901246+06:30	2024-12-31 16:32:39.110638+06:30
12	2	10	record_view	f	2024-12-31 18:15:14.719371+06:30	2024-12-31 18:15:14.719371+06:30
70	5	57	live_view	f	2025-01-02 19:07:54.194729+06:30	2025-01-02 19:08:05.691463+06:30
13	5	11	live_view	f	2024-12-31 18:19:56.56512+06:30	2024-12-31 18:37:43.078881+06:30
26	1	23	live_view	f	2025-01-01 12:51:47.158913+06:30	2025-01-01 13:00:18.115975+06:30
14	5	12	live_view	f	2024-12-31 18:39:17.205581+06:30	2024-12-31 18:45:56.100481+06:30
54	5	47	live_view	f	2025-01-01 20:10:00.260384+06:30	2025-01-01 20:10:57.978078+06:30
15	5	13	live_view	f	2024-12-31 19:51:36.064483+06:30	2024-12-31 19:57:57.58027+06:30
55	2	47	live_view	f	2025-01-01 20:10:08.189048+06:30	2025-01-01 20:10:57.979461+06:30
27	5	24	live_view	f	2025-01-01 13:05:57.676047+06:30	2025-01-01 13:06:06.98277+06:30
16	5	14	live_view	f	2024-12-31 20:14:00.710165+06:30	2024-12-31 20:21:07.074726+06:30
43	1	39	live_view	f	2025-01-01 15:36:12.078577+06:30	2025-01-01 15:38:36.685573+06:30
17	5	15	live_view	f	2024-12-31 20:32:06.647182+06:30	2024-12-31 20:35:26.969595+06:30
42	5	39	live_view	f	2025-01-01 15:36:03.618623+06:30	2025-01-01 16:05:52.338317+06:30
28	5	25	live_view	f	2025-01-01 13:07:09.437786+06:30	2025-01-01 13:08:02.472418+06:30
18	5	16	live_view	f	2024-12-31 20:36:06.594378+06:30	2024-12-31 21:15:10.078272+06:30
19	5	17	live_view	f	2024-12-31 21:16:53.505271+06:30	2024-12-31 21:30:57.418715+06:30
29	5	26	live_view	f	2025-01-01 13:09:24.119774+06:30	2025-01-01 13:09:28.158521+06:30
20	5	18	live_view	f	2024-12-31 21:31:23.081781+06:30	2024-12-31 21:31:52.621112+06:30
21	5	19	live_view	f	2024-12-31 21:33:33.726387+06:30	2024-12-31 21:53:05.371829+06:30
71	5	58	live_view	f	2025-01-02 19:09:28.094251+06:30	2025-01-02 19:09:41.151328+06:30
56	5	48	live_view	f	2025-01-01 20:14:23.557995+06:30	2025-01-01 20:15:10.420312+06:30
57	2	48	live_view	f	2025-01-01 20:14:30.502459+06:30	2025-01-01 20:15:10.469807+06:30
38	5	35	live_view	f	2025-01-01 14:24:29.546859+06:30	2025-01-01 14:39:48.85018+06:30
31	1	27	live_view	f	2025-01-01 13:14:37.336269+06:30	2025-01-01 13:56:08.881161+06:30
30	5	27	live_view	f	2025-01-01 13:14:13.71001+06:30	2025-01-01 14:03:09.222966+06:30
39	1	35	live_view	f	2025-01-01 14:24:46.464531+06:30	2025-01-01 14:44:42.935658+06:30
45	1	41	live_view	f	2025-01-01 16:07:03.726849+06:30	2025-01-01 16:08:09.195942+06:30
44	5	41	live_view	f	2025-01-01 16:06:51.374841+06:30	2025-01-01 16:08:45.626574+06:30
72	5	59	live_view	f	2025-01-02 19:26:43.624547+06:30	2025-01-02 19:27:24.570509+06:30
32	5	30	live_view	f	2025-01-01 14:03:58.339479+06:30	2025-01-01 14:12:15.582008+06:30
33	1	30	live_view	f	2025-01-01 14:04:13.147241+06:30	2025-01-01 14:12:15.754166+06:30
58	5	49	live_view	f	2025-01-01 20:32:21.477985+06:30	2025-01-01 20:32:48.9457+06:30
46	5	42	live_view	f	2025-01-01 16:14:37.344349+06:30	2025-01-01 16:15:49.768644+06:30
59	2	49	live_view	f	2025-01-01 20:32:27.271671+06:30	2025-01-01 20:32:49.007059+06:30
47	2	42	live_view	f	2025-01-01 16:14:52.76402+06:30	2025-01-01 16:15:49.793025+06:30
73	2	61	record_view	f	2025-01-07 00:50:39.674375+06:30	2025-01-07 00:50:39.674375+06:30
48	5	43	live_view	f	2025-01-01 16:25:50.881957+06:30	2025-01-01 16:26:00.109417+06:30
74	2	59	record_view	f	2025-01-07 16:58:50.562656+06:30	2025-01-07 16:58:50.562656+06:30
61	2	50	live_view	f	2025-01-01 20:46:28.381065+06:30	2025-01-01 20:46:48.119215+06:30
60	5	50	live_view	f	2025-01-01 20:46:17.494888+06:30	2025-01-01 20:46:48.119215+06:30
40	5	37	live_view	f	2025-01-01 14:45:27.382185+06:30	2025-01-01 15:18:10.169171+06:30
49	5	44	live_view	f	2025-01-01 16:26:49.191504+06:30	2025-01-01 16:27:27.759131+06:30
50	2	44	live_view	f	2025-01-01 16:27:00.809682+06:30	2025-01-01 16:27:27.758952+06:30
41	1	37	live_view	f	2025-01-01 14:45:40.163815+06:30	2025-01-01 15:35:26.470943+06:30
62	5	51	live_view	f	2025-01-02 13:22:33.576265+06:30	2025-01-02 13:23:16.490577+06:30
51	5	45	live_view	f	2025-01-01 16:29:05.402109+06:30	2025-01-01 16:30:06.364294+06:30
63	5	52	live_view	f	2025-01-02 13:58:01.304189+06:30	2025-01-02 13:58:59.514811+06:30
52	2	45	live_view	f	2025-01-01 16:29:17.20886+06:30	2025-01-01 16:30:06.377735+06:30
64	2	52	live_view	f	2025-01-02 13:58:27.325695+06:30	2025-01-02 13:58:59.539383+06:30
66	2	53	live_view	f	2025-01-02 14:05:59.788591+06:30	2025-01-02 14:06:24.869724+06:30
65	5	53	live_view	f	2025-01-02 14:05:45.021588+06:30	2025-01-02 14:06:24.869753+06:30
67	5	54	live_view	f	2025-01-02 18:57:49.577113+06:30	2025-01-02 18:58:04.623767+06:30
68	5	55	live_view	f	2025-01-02 18:58:32.342772+06:30	2025-01-02 18:58:45.466977+06:30
76	2	62	live_view	f	2025-01-08 21:18:25.550653+06:30	2025-01-08 21:19:41.465618+06:30
75	5	62	live_view	f	2025-01-08 21:17:22.58644+06:30	2025-01-08 21:20:12.570774+06:30
78	2	63	live_view	f	2025-01-09 12:00:40.676155+06:30	2025-01-09 12:03:03.237021+06:30
77	5	63	live_view	f	2025-01-09 11:44:34.960243+06:30	2025-01-09 12:10:11.591611+06:30
79	5	64	live_view	f	2025-01-09 12:51:55.908192+06:30	2025-01-09 13:06:45.382519+06:30
80	5	65	live_view	f	2025-01-09 13:08:02.30272+06:30	2025-01-09 13:09:21.237132+06:30
81	5	66	live_view	f	2025-01-09 13:12:37.431843+06:30	2025-01-09 13:16:26.857507+06:30
82	5	67	live_view	f	2025-01-09 13:17:34.92118+06:30	2025-01-09 13:18:38.769277+06:30
83	5	68	live_view	f	2025-01-09 13:57:09.522985+06:30	2025-01-09 13:57:33.881746+06:30
84	5	69	live_view	f	2025-01-09 14:36:55.702286+06:30	2025-01-09 14:48:04.286179+06:30
85	5	71	live_view	f	2025-01-09 14:59:00.459847+06:30	2025-01-09 15:34:04.043972+06:30
87	2	72	live_view	f	2025-01-09 15:38:07.222966+06:30	2025-01-09 15:38:26.264792+06:30
86	5	72	live_view	f	2025-01-09 15:34:43.5709+06:30	2025-01-09 15:40:49.724185+06:30
88	5	74	live_view	f	2025-01-09 16:08:45.508765+06:30	2025-01-09 16:26:17.673338+06:30
89	5	76	live_view	f	2025-01-09 16:40:40.119287+06:30	2025-01-09 16:41:28.635213+06:30
90	5	77	record_view	f	2025-01-09 16:41:49.83279+06:30	2025-01-09 16:41:49.83279+06:30
91	5	78	live_view	f	2025-01-09 16:42:34.828244+06:30	2025-01-09 16:43:16.012323+06:30
92	5	80	live_view	f	2025-01-09 16:55:35.724015+06:30	2025-01-09 16:56:13.764644+06:30
93	5	84	live_view	f	2025-01-09 17:04:13.99777+06:30	2025-01-09 17:05:01.869693+06:30
94	5	85	live_view	f	2025-01-09 17:05:58.586499+06:30	2025-01-09 17:08:19.830035+06:30
95	5	86	live_view	f	2025-01-09 17:10:04.618224+06:30	2025-01-09 17:13:30.525288+06:30
96	5	87	live_view	f	2025-01-09 17:13:56.123273+06:30	2025-01-09 17:15:15.399195+06:30
97	5	88	live_view	f	2025-01-09 17:43:30.125876+06:30	2025-01-09 17:45:13.750909+06:30
98	5	89	live_view	f	2025-01-09 17:45:32.869944+06:30	2025-01-09 17:47:56.064386+06:30
100	2	90	live_view	f	2025-01-09 17:54:05.173165+06:30	2025-01-09 17:54:14.082267+06:30
99	5	90	live_view	f	2025-01-09 17:52:51.506718+06:30	2025-01-09 17:56:59.871082+06:30
101	5	91	live_view	f	2025-01-09 17:58:01.380846+06:30	2025-01-09 18:50:13.253497+06:30
103	2	92	live_view	f	2025-01-09 18:53:47.637499+06:30	2025-01-09 18:54:26.051687+06:30
102	5	92	live_view	f	2025-01-09 18:50:59.98621+06:30	2025-01-09 19:09:14.230433+06:30
104	5	93	live_view	f	2025-01-09 19:13:10.796758+06:30	2025-01-09 19:14:37.317257+06:30
106	2	94	live_view	f	2025-01-09 19:17:54.397528+06:30	2025-01-09 19:17:59.649322+06:30
105	5	94	live_view	f	2025-01-09 19:16:22.171176+06:30	2025-01-09 19:18:15.286816+06:30
107	5	95	live_view	f	2025-01-09 20:29:39.043341+06:30	2025-01-09 20:31:04.189492+06:30
110	5	98	live_view	f	2025-01-09 21:56:05.254733+06:30	2025-01-09 22:00:35.079135+06:30
112	2	99	live_view	f	2025-01-09 22:32:39.935895+06:30	2025-01-09 22:32:55.924701+06:30
111	5	99	live_view	f	2025-01-09 22:31:16.994923+06:30	2025-01-09 22:32:59.71837+06:30
109	5	97	live_view	f	2025-01-09 20:44:20.452929+06:30	2025-01-10 12:41:35.846495+06:30
108	5	96	live_view	f	2025-01-09 20:42:45.907524+06:30	2025-01-10 12:57:20.378049+06:30
113	2	65	record_view	f	2025-01-10 15:04:39.485019+06:30	2025-01-10 15:04:39.485019+06:30
114	25	99	record_view	f	2025-01-12 17:08:50.643711+06:30	2025-01-12 17:08:50.643711+06:30
\.


--
-- Name: admin_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_logs_id_seq', 13, true);


--
-- Name: bookmarks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookmarks_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 5, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 125, true);


--
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.likes_id_seq', 91, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- Name: schedule_streams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_streams_id_seq', 2, true);


--
-- Name: shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shares_id_seq', 1, false);


--
-- Name: stream_analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stream_analytics_id_seq', 84, true);


--
-- Name: streams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.streams_id_seq', 99, true);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 6, true);


--
-- Name: two_fas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.two_fas_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 25, true);


--
-- Name: views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.views_id_seq', 114, true);


--
-- Name: admin_logs admin_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_logs
    ADD CONSTRAINT admin_logs_pkey PRIMARY KEY (id);


--
-- Name: blocked_lists blocked_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocked_lists
    ADD CONSTRAINT blocked_lists_pkey PRIMARY KEY (user_id, blocked_user_id);


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: schedule_streams schedule_streams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_streams
    ADD CONSTRAINT schedule_streams_pkey PRIMARY KEY (id);


--
-- Name: shares shares_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT shares_pkey PRIMARY KEY (id);


--
-- Name: stream_analytics stream_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_analytics
    ADD CONSTRAINT stream_analytics_pkey PRIMARY KEY (id);


--
-- Name: stream_categories stream_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_categories
    ADD CONSTRAINT stream_categories_pkey PRIMARY KEY (category_id, stream_id);


--
-- Name: streams streams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streams
    ADD CONSTRAINT streams_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: two_fas two_fas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.two_fas
    ADD CONSTRAINT two_fas_pkey PRIMARY KEY (id);


--
-- Name: categories uni_categories_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT uni_categories_name UNIQUE (name);


--
-- Name: roles uni_roles_type; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT uni_roles_type UNIQUE (type);


--
-- Name: stream_analytics uni_stream_analytics_stream_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_analytics
    ADD CONSTRAINT uni_stream_analytics_stream_id UNIQUE (stream_id);


--
-- Name: two_fas uni_two_fas_user_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.two_fas
    ADD CONSTRAINT uni_two_fas_user_id UNIQUE (user_id);


--
-- Name: users uni_users_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uni_users_email UNIQUE (email);


--
-- Name: users uni_users_username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uni_users_username UNIQUE (username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: views views_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.views
    ADD CONSTRAINT views_pkey PRIMARY KEY (id);


--
-- Name: idx_bookmark_user_stream; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_bookmark_user_stream ON public.bookmarks USING btree (user_id, stream_id);


--
-- Name: idx_streamer_subscriber; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_streamer_subscriber ON public.subscriptions USING btree (subscriber_id, streamer_id);


--
-- Name: idx_user_stream; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_user_stream ON public.likes USING btree (user_id, stream_id);


--
-- Name: idx_users_created_by_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_created_by_id ON public.users USING btree (created_by_id);


--
-- Name: idx_users_updated_by_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_updated_by_id ON public.users USING btree (updated_by_id);


--
-- Name: idx_view_user_stream; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_view_user_stream ON public.views USING btree (user_id, stream_id);


--
-- Name: blocked_lists fk_blocked_lists_blocked_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocked_lists
    ADD CONSTRAINT fk_blocked_lists_blocked_user FOREIGN KEY (blocked_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: blocked_lists fk_blocked_lists_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocked_lists
    ADD CONSTRAINT fk_blocked_lists_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bookmarks fk_bookmarks_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT fk_bookmarks_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: bookmarks fk_bookmarks_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: comments fk_comments_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: comments fk_comments_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: likes fk_likes_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT fk_likes_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: likes fk_likes_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications fk_notifications_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: notifications fk_notifications_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users fk_roles_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_roles_users FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: schedule_streams fk_schedule_streams_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_streams
    ADD CONSTRAINT fk_schedule_streams_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: shares fk_shares_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT fk_shares_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: shares fk_shares_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT fk_shares_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: stream_analytics fk_stream_analytics_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_analytics
    ADD CONSTRAINT fk_stream_analytics_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: stream_categories fk_stream_categories_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_categories
    ADD CONSTRAINT fk_stream_categories_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: stream_categories fk_stream_categories_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_categories
    ADD CONSTRAINT fk_stream_categories_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: streams fk_streams_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streams
    ADD CONSTRAINT fk_streams_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: subscriptions fk_subscriptions_streamer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT fk_subscriptions_streamer FOREIGN KEY (streamer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: subscriptions fk_subscriptions_subscriber; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT fk_subscriptions_subscriber FOREIGN KEY (subscriber_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: two_fas fk_two_fas_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.two_fas
    ADD CONSTRAINT fk_two_fas_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: admin_logs fk_users_admin_logs; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_logs
    ADD CONSTRAINT fk_users_admin_logs FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users fk_users_created_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: categories fk_users_created_by_categories; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT fk_users_created_by_categories FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: users fk_users_updated_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: categories fk_users_updated_by_categories; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT fk_users_updated_by_categories FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: views fk_views_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.views
    ADD CONSTRAINT fk_views_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- Name: views fk_views_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.views
    ADD CONSTRAINT fk_views_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

