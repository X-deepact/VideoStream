--
-- PostgreSQL database dump
--

-- Dumped from database version 11.8
-- Dumped by pg_dump version 15.3

-- Started on 2025-01-19 17:45:34

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

--
-- TOC entry 6 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3215 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 196 (class 1259 OID 16385)
-- Name: admin_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admin_logs_id_seq OWNER TO postgres;

SET default_tablespace = '';

--
-- TOC entry 197 (class 1259 OID 16387)
-- Name: admin_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_logs (
    id bigint DEFAULT nextval('public.admin_logs_id_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    action character varying(100) NOT NULL,
    details text,
    performed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin_logs OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 16395)
-- Name: blocked_lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blocked_lists (
    user_id bigint NOT NULL,
    blocked_user_id bigint NOT NULL,
    blocked_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.blocked_lists OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24579)
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
-- TOC entry 226 (class 1259 OID 24577)
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
-- TOC entry 3217 (class 0 OID 0)
-- Dependencies: 226
-- Name: bookmarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookmarks_id_seq OWNED BY public.bookmarks.id;


--
-- TOC entry 199 (class 1259 OID 16399)
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
-- TOC entry 200 (class 1259 OID 16401)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint DEFAULT nextval('public.categories_id_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by_id bigint NOT NULL,
    updated_by_id bigint NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 16407)
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
-- TOC entry 202 (class 1259 OID 16409)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id bigint DEFAULT nextval('public.comments_id_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16418)
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
-- TOC entry 204 (class 1259 OID 16420)
-- Name: likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.likes (
    id bigint DEFAULT nextval('public.likes_id_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    like_emote character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 16426)
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
-- TOC entry 206 (class 1259 OID 16428)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint DEFAULT nextval('public.notifications_id_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    type character varying(50) NOT NULL,
    read_at timestamp with time zone,
    hidden_at timestamp with time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 16436)
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
-- TOC entry 208 (class 1259 OID 16438)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint DEFAULT nextval('public.roles_id_seq'::regclass) NOT NULL,
    type character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16447)
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
-- TOC entry 210 (class 1259 OID 16455)
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
-- TOC entry 3218 (class 0 OID 0)
-- Dependencies: 210
-- Name: schedule_streams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedule_streams_id_seq OWNED BY public.schedule_streams.id;


--
-- TOC entry 211 (class 1259 OID 16457)
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
-- TOC entry 212 (class 1259 OID 16459)
-- Name: shares; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shares (
    id bigint DEFAULT nextval('public.shares_id_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.shares OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 16464)
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
-- TOC entry 214 (class 1259 OID 16466)
-- Name: stream_analytics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stream_analytics (
    id bigint DEFAULT nextval('public.stream_analytics_id_seq'::regclass) NOT NULL,
    stream_id bigint NOT NULL,
    views bigint NOT NULL,
    likes bigint NOT NULL,
    comments bigint NOT NULL,
    video_size bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    duration bigint DEFAULT '0'::bigint NOT NULL,
    shares bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.stream_analytics OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16473)
-- Name: stream_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stream_categories (
    category_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.stream_categories OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16477)
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
-- TOC entry 217 (class 1259 OID 16479)
-- Name: streams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.streams (
    id bigint DEFAULT nextval('public.streams_id_seq'::regclass) NOT NULL,
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
-- TOC entry 218 (class 1259 OID 16488)
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
-- TOC entry 219 (class 1259 OID 16490)
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id bigint DEFAULT nextval('public.subscriptions_id_seq'::regclass) NOT NULL,
    subscriber_id bigint NOT NULL,
    streamer_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_mute boolean DEFAULT false NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16495)
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
-- TOC entry 221 (class 1259 OID 16497)
-- Name: two_fas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.two_fas (
    id bigint DEFAULT nextval('public.two_fas_id_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    secret text NOT NULL,
    is2fa_enabled boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.two_fas OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16507)
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
-- TOC entry 223 (class 1259 OID 16509)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
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
    avatar_file_name character varying(255),
    status character varying(50) DEFAULT 'offline'::character varying NOT NULL,
    blocked_reason text,
    num_notification bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16518)
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
-- TOC entry 225 (class 1259 OID 16520)
-- Name: views; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.views (
    id bigint DEFAULT nextval('public.views_id_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    stream_id bigint NOT NULL,
    view_type character varying(50) NOT NULL,
    is_viewing boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.views OWNER TO postgres;

--
-- TOC entry 2970 (class 2604 OID 24582)
-- Name: bookmarks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks ALTER COLUMN id SET DEFAULT nextval('public.bookmarks_id_seq'::regclass);


--
-- TOC entry 2939 (class 2604 OID 16527)
-- Name: schedule_streams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_streams ALTER COLUMN id SET DEFAULT nextval('public.schedule_streams_id_seq'::regclass);


--
-- TOC entry 3179 (class 0 OID 16387)
-- Dependencies: 197
-- Data for Name: admin_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_logs (id, user_id, action, details, performed_at) FROM stdin;
1	1	login	User superAdmin@gmail.com logged in	2024-12-10 06:30:11.548138+00
2	2	login	User binh@gmail.com logged in	2024-12-10 06:30:40.964549+00
3	1	login	User superAdmin@gmail.com logged in	2024-12-20 13:02:16.670375+00
4	1	login	User superAdmin@gmail.com logged in	2024-12-22 05:25:42.51112+00
5	1	login	User superAdmin@gmail.com logged in	2024-12-22 06:58:37.906359+00
6	1	login	User superAdmin@gmail.com logged in	2024-12-22 09:58:09.110579+00
7	1	login	User superAdmin@gmail.com logged in	2024-12-23 04:06:48.589547+00
3115	1	login	superAdmin logged in.	2025-01-12 06:44:34.436048+00
3117	1	login	superAdmin logged in.	2025-01-13 10:35:13.37041+00
3121	1	login	superAdmin logged in.	2025-01-14 05:04:35.267591+00
3123	1	login	superAdmin logged in.	2025-01-14 06:27:22.834443+00
3124	1	login	superAdmin logged in.	2025-01-14 14:03:23.574347+00
3125	1	login	superAdmin logged in.	2025-01-15 04:28:58.010993+00
3126	1	login	superAdmin logged in.	2025-01-15 04:30:57.896296+00
8	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 12:05:53.800572+00
9	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 12:05:55.623206+00
10	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 15:37:16.953779+00
11	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 15:37:20.507548+00
12	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 15:37:20.556426+00
13	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 15:38:31.970749+00
14	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 15:39:10.817969+00
15	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 15:40:29.60196+00
16	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 15:40:29.656397+00
17	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 15:40:54.309913+00
18	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 15:42:41.015011+00
19	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 15:42:41.017888+00
20	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 15:43:07.980583+00
21	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-24 15:43:08.077098+00
22	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:24:16.026408+00
23	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:24:16.032304+00
24	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:24:18.517226+00
25	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:24:18.519763+00
26	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:24:41.062787+00
27	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:24:41.111984+00
28	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:25:33.983621+00
29	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:25:33.985852+00
30	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:55:48.909666+00
31	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:55:48.9132+00
32	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:55:51.114829+00
33	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:55:51.119918+00
34	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:57:54.96821+00
35	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 10:57:54.973271+00
36	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:00:29.487668+00
37	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:00:36.493935+00
38	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:00:41.535152+00
39	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:00:41.573782+00
40	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:02:05.521109+00
41	1	login	 superAdmin@gmail.com logged in	2024-12-26 11:03:11.122005+00
42	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:07:30.502205+00
43	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:12:34.513701+00
44	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:13:02.459897+00
45	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:13:25.917464+00
46	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:13:25.967799+00
47	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:17:30.493016+00
48	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:17:34.904755+00
49	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:17:34.910916+00
50	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:21:25.494222+00
51	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:22:50.458104+00
52	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:22:54.486327+00
53	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:23:01.002764+00
54	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:23:01.040142+00
55	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:24:50.495747+00
56	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:25:01.724422+00
57	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:25:01.726729+00
58	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:25:11.349235+00
59	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:25:46.171553+00
60	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:25:50.008639+00
61	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:25:50.01172+00
62	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:30:22.67741+00
63	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 11:30:22.706359+00
64	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 13:02:56.075374+00
65	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 13:02:56.078103+00
66	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 14:26:18.824879+00
67	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 14:26:18.826027+00
68	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 14:26:19.784578+00
69	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 14:26:19.802074+00
70	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-26 14:30:12.431374+00
71	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 05:02:16.86594+00
72	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 05:02:16.872704+00
73	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 05:12:00.962276+00
74	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 05:12:01.030145+00
75	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 05:18:11.838069+00
76	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 05:18:11.847025+00
77	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 05:27:07.51179+00
78	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 05:27:07.525611+00
79	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 06:03:29.968799+00
80	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 06:03:29.970274+00
81	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 11:32:28.547499+00
82	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 11:32:28.563518+00
83	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:11:31.925095+00
84	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:11:31.93009+00
85	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:13:04.827934+00
86	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:13:04.831742+00
87	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:16:39.099516+00
88	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:27:19.098204+00
89	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:27:19.101278+00
3116	1	login	superAdmin logged in.	2025-01-12 08:48:43.07686+00
91	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:28:50.764393+00
92	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:28:50.779365+00
3118	1	login	superAdmin logged in.	2025-01-13 10:53:22.963715+00
94	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:32:43.856163+00
95	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:32:43.859233+00
3119	1	admin_deactive_user	superAdmin de-active user1.	2025-01-13 10:54:23.925895+00
97	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:33:22.495076+00
98	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-27 14:33:22.52033+00
99	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:13:18.120627+00
100	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:13:29.046313+00
101	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:13:29.049957+00
102	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:19:31.743336+00
103	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:19:31.748667+00
104	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:34:22.354641+00
105	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:34:22.358377+00
106	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:34:40.300803+00
107	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:34:40.304038+00
108	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:35:09.767684+00
109	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:35:09.810918+00
110	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:51:37.178068+00
111	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 06:51:37.184797+00
112	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:05:17.846809+00
113	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:05:17.886415+00
114	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:05:28.610856+00
115	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:05:28.614977+00
116	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:05:48.948817+00
117	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:05:48.950961+00
118	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:05:56.06122+00
119	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:05:56.06413+00
120	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:06:04.335734+00
121	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:06:04.383268+00
122	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:06:09.082313+00
123	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:06:09.085018+00
124	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:07:16.917881+00
125	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:07:16.920987+00
126	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:07:26.675742+00
127	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 07:07:26.680129+00
128	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 09:49:49.28739+00
129	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 09:49:49.29635+00
130	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 09:49:50.652979+00
131	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 09:49:50.660471+00
132	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 10:16:19.052211+00
133	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 10:16:19.05705+00
134	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 10:16:49.611149+00
3122	1	login	superAdmin logged in.	2025-01-14 05:07:29.195881+00
135	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 10:16:49.666341+00
136	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 10:54:46.2471+00
139	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 10:56:03.879211+00
140	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 10:56:03.882506+00
3120	1	login	superAdmin logged in.	2025-01-13 11:43:02.652731+00
3127	1	login	superAdmin logged in.	2025-01-15 10:43:59.059878+00
3128	1	admin_reactive_user	superAdmin re-active user1.	2025-01-15 10:46:05.380811+00
137	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-28 10:54:46.252703+00
3129	1	create_user	superAdmin created testuser123445sadsadasd with role type user.	2025-01-15 10:53:07.52255+00
142	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 14:58:05.535243+00
143	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 14:58:05.577188+00
144	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 14:58:07.518427+00
145	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 14:58:07.533328+00
146	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 14:58:15.201676+00
147	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 14:58:15.205084+00
148	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 14:58:16.920336+00
149	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 14:58:17.074214+00
150	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:31.520175+00
151	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:31.520234+00
152	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:34.722582+00
153	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:34.766261+00
154	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:40.536885+00
155	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:40.564868+00
156	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:41.617246+00
157	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:41.617856+00
158	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:44.220848+00
159	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:44.242726+00
160	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:44.946859+00
161	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:44.948127+00
162	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:45.407646+00
163	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:45.40927+00
164	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:46.985161+00
165	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:47.040417+00
166	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:47.57648+00
167	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:47.588506+00
168	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:48.054745+00
169	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:48.109822+00
170	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:48.94854+00
171	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:48.997201+00
172	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:49.319839+00
173	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:49.321951+00
174	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:49.774287+00
175	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:49.813416+00
176	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:50.578632+00
177	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:50.627836+00
178	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:50.910399+00
179	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:50.910527+00
180	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:52.243389+00
181	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:03:52.299682+00
182	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:04:15.889215+00
183	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:04:15.88928+00
184	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:04:18.340171+00
185	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:04:18.346395+00
186	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:04:30.077569+00
187	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:04:30.095244+00
188	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:04:31.288657+00
189	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:04:31.288789+00
190	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:04:32.05657+00
191	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:04:32.097104+00
192	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:04:40.816989+00
193	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:04:40.817046+00
194	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:05:36.305114+00
195	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:05:36.333755+00
196	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:05:53.677433+00
197	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:05:53.680552+00
198	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:06:25.805445+00
199	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:06:25.822858+00
200	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:06:28.747671+00
201	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:06:28.748468+00
202	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:06:30.021605+00
203	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:06:30.036247+00
204	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:08:44.740568+00
205	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:08:44.750102+00
206	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:08:46.143844+00
207	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:08:46.143845+00
208	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:08:48.79291+00
209	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:08:48.809164+00
210	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:10:54.666908+00
211	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:10:54.716039+00
212	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:13:07.228654+00
213	1	user_list	 superAdmin@gmail.com make UserListAction request	2024-12-30 15:13:07.237162+00
3130	1	login	superAdmin logged in.	2025-01-15 13:05:04.205904+00
3137	1	login	superAdmin logged in.	2025-01-17 06:37:07.082325+00
3131	1	login	superAdmin logged in.	2025-01-16 06:52:29.732854+00
3132	1	create_category	superAdmin created a category with name test213.	2025-01-16 06:52:56.369015+00
3133	1	login	superAdmin logged in.	2025-01-16 06:54:13.064655+00
3134	1	update_category	superAdmin update a category with name 123test.	2025-01-16 06:57:03.082644+00
3135	1	delete_category	superAdmin delete category 6	2025-01-16 06:57:43.007933+00
3138	1	login	superAdmin logged in.	2025-01-17 07:04:36.652078+00
3147	1	login	superAdmin logged in.	2025-01-19 05:14:22.256958+00
3136	1	login	superAdmin logged in.	2025-01-16 07:10:13.511246+00
3139	1	login	superAdmin logged in.	2025-01-17 07:23:25.9441+00
3140	1	login	superAdmin logged in.	2025-01-17 07:24:02.111273+00
3148	1	login	superAdmin logged in.	2025-01-19 05:20:20.496236+00
3141	1	login	superAdmin logged in.	2025-01-17 07:28:05.263128+00
3149	1	login	superAdmin logged in.	2025-01-19 10:11:58.531311+00
3142	1	login	superAdmin logged in.	2025-01-17 10:02:15.887945+00
3150	1	login	superAdmin logged in.	2025-01-19 10:28:45.713789+00
3143	1	login	superAdmin logged in.	2025-01-17 10:11:21.749106+00
3151	1	create_user	superAdmin created algo12345 with role type streamer.	2025-01-19 10:31:01.63869+00
3152	1	login	superAdmin logged in.	2025-01-19 10:41:14.939916+00
3144	1	login	superAdmin logged in.	2025-01-17 11:31:05.788757+00
3145	1	login	superAdmin logged in.	2025-01-17 11:39:38.614298+00
3146	1	login	superAdmin logged in.	2025-01-17 11:42:07.19397+00
1279	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.044558+00
3099	1	login	 superAdmin@gmail.com logged in	2025-01-08 06:26:31.707448+00
3100	1	login	 superAdmin@gmail.com logged in	2025-01-08 06:26:39.904662+00
3101	1	create_category	 superAdmin@gmail.com create_category request	2025-01-08 06:28:16.589582+00
3102	1	update_live_stream_by_admin	 superAdmin@gmail.com update_thumbnail_stream_by_admin request	2025-01-08 13:10:23.826803+00
3103	1	update_live_stream_by_admin	 superAdmin@gmail.com update_thumbnail_stream_by_admin request	2025-01-08 13:11:46.938884+00
3104	1	update_live_stream_by_admin	 superAdmin@gmail.com update_thumbnail_stream_by_admin request	2025-01-09 05:05:00.264502+00
3105	2	login	 binh@gmail.com logged in	2025-01-09 06:12:42.66199+00
3106	6	login	 momo@gmail.com logged in	2025-01-09 07:50:20.947904+00
1321	6	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.347419+00
3107	1	login	 superAdmin@gmail.com logged in	2025-01-09 07:53:47.153505+00
3108	1	update_live_stream_by_admin	 superAdmin@gmail.com update_schedule_stream_by_admin request	2025-01-09 09:59:53.317092+00
3109	1	update_live_stream_by_admin	 superAdmin@gmail.com update_schedule_stream_by_admin request	2025-01-09 10:00:59.325898+00
3110	1	update_stream_by_admin	 superAdmin@gmail.com update_schedule_stream_by_admin request	2025-01-09 10:14:49.543701+00
3111	1	update_scheduled_stream_by_admin	superAdmin updated a scheduled stream with id 47.	2025-01-09 13:42:02.614288+00
3112	1	update_scheduled_stream_by_admin	superAdmin updated a scheduled stream with id 47.	2025-01-09 13:43:19.888616+00
3113	1	login	superAdmin logged in.	2025-01-10 05:02:15.685843+00
1546	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.720026+00
1547	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.727666+00
1550	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.746004+00
1553	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.749412+00
1554	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.752234+00
1556	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.75487+00
1557	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.758085+00
90	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2024-12-27 14:27:52.213715+00
93	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2024-12-27 14:31:55.434491+00
96	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2024-12-27 14:33:13.640606+00
141	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2024-12-28 10:57:23.401005+00
1548	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.727736+00
1549	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.738684+00
1551	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.746404+00
1552	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.749187+00
1555	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.752555+00
1558	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.758145+00
1560	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.764131+00
1561	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.768253+00
1562	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.782979+00
1563	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.789303+00
1564	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.791994+00
1565	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.793532+00
1566	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:57:36.94845+00
1569	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:57:36.95265+00
1570	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:57:36.95596+00
1577	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:07:50.956822+00
1578	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:07:50.960459+00
1581	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:07:50.965516+00
1582	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:07:50.990993+00
1583	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:07:50.993952+00
1584	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:07:50.995375+00
1585	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:07:50.99817+00
1586	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:08:51.954544+00
1587	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.41648+00
1589	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.426879+00
1590	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.430137+00
1593	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.437277+00
1594	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.446877+00
1596	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.456407+00
1597	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.462979+00
1604	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.496119+00
1605	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.56885+00
1606	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.571309+00
1869	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.479972+00
1871	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.501143+00
1874	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.532688+00
1876	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.548148+00
1877	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.563268+00
1878	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.571767+00
1879	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.578375+00
1883	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.60153+00
1886	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.628874+00
1887	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.640451+00
1888	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:48.039873+00
1889	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:48.042163+00
1891	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:48.046996+00
1893	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:48.051685+00
1897	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:48.086555+00
1899	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.765629+00
1900	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.771253+00
1903	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.776804+00
1905	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.790371+00
1906	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.794937+00
1909	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.802729+00
1910	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.805693+00
1990	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.791563+00
1992	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.798676+00
1993	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.810579+00
1995	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.823826+00
1996	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.829298+00
1997	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.832612+00
2000	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.881304+00
2003	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:15.972534+00
2006	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:15.987481+00
2007	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:15.991967+00
138	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2024-12-28 10:55:50.743081+00
214	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-03 08:08:56.926627+00
215	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:35:50.585798+00
216	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:35:50.587489+00
217	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:35:50.627233+00
218	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:03.587174+00
219	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:03.587343+00
220	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:03.621911+00
221	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:05.430458+00
222	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:05.586196+00
223	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:05.725331+00
224	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:05.725744+00
225	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:05.759495+00
226	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:05.76955+00
227	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:27.593108+00
228	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:27.593431+00
229	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:27.640274+00
230	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:30.502967+00
231	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:30.692039+00
232	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:31.466077+00
233	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:31.733793+00
234	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:31.734037+00
235	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:32.219679+00
236	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:52.585677+00
237	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:52.585785+00
238	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:52.617897+00
239	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:54.780179+00
240	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:54.780117+00
241	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:54.830678+00
242	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:54.83163+00
243	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:54.864909+00
244	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:36:54.946863+00
245	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:08.652106+00
246	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:08.692996+00
247	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:08.889036+00
248	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:08.889752+00
249	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:08.899177+00
250	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:08.922698+00
251	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:12.440874+00
252	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:12.45299+00
253	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:12.576944+00
254	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:12.641967+00
255	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:12.64226+00
256	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:12.714866+00
257	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:16.049925+00
258	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:19.868922+00
259	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:23.115285+00
260	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:41:24.320931+00
261	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:42:00.57289+00
262	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:42:00.573382+00
263	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:42:00.603488+00
264	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:42:05.385748+00
265	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:42:05.390524+00
266	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:42:05.398362+00
267	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:42:30.076401+00
268	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:43:01.288789+00
269	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:43:01.288951+00
270	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:43:01.326003+00
271	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:43:05.788929+00
272	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:43:12.874506+00
273	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:43:14.256462+00
274	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:43:16.473972+00
275	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:43:17.994117+00
276	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:44:59.460382+00
277	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:44:59.460551+00
278	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:44:59.463627+00
279	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:45:02.31684+00
280	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:45:15.427847+00
281	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:45:17.879788+00
282	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:45:25.780773+00
1559	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:56:57.763698+00
1567	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:57:36.948961+00
1568	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:57:36.952413+00
1571	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:57:36.956577+00
1572	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:57:36.985127+00
1573	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:57:36.98647+00
1574	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:57:36.990875+00
1575	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:57:37.087885+00
1576	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:07:50.956605+00
1579	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:07:50.960569+00
1580	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:07:50.965231+00
1588	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.426818+00
1591	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.43036+00
1592	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.437038+00
1595	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.455206+00
1598	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.463422+00
1599	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.468343+00
1600	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.471295+00
1601	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.474724+00
1602	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.493061+00
1603	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:11:38.494741+00
1873	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.519148+00
1875	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.541209+00
1880	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.583657+00
1881	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.587828+00
1882	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.595814+00
1885	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.611815+00
1890	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:48.042355+00
1892	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:48.04707+00
1894	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:48.05204+00
1895	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:48.078513+00
1896	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:48.08317+00
1898	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.749151+00
1901	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.771286+00
1902	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.775384+00
1904	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.787987+00
1907	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.798724+00
1908	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.801464+00
1911	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.806777+00
1912	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.809363+00
1913	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.824022+00
1914	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.827069+00
1915	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.831672+00
1917	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.873819+00
1918	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:57.002082+00
1919	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.26556+00
1921	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.30225+00
1925	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.349153+00
1930	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.37111+00
1932	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.387901+00
1935	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.392963+00
1991	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.797946+00
1994	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.812966+00
1998	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.837652+00
2109	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.6492+00
2110	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.668347+00
2112	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.687219+00
2116	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.699409+00
2156	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.263422+00
2161	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.283726+00
2163	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.295999+00
2168	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.298443+00
2171	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.326961+00
2172	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.332948+00
2175	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.369799+00
2178	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.3824+00
2179	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.386453+00
283	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:45:25.781199+00
284	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-05 10:45:25.822056+00
285	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 05:32:37.722852+00
286	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:30.967784+00
287	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:30.971356+00
288	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:30.973145+00
289	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:30.982246+00
290	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:30.986138+00
291	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:30.98629+00
292	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:31.008877+00
293	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:31.011276+00
294	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:31.011611+00
295	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:31.013733+00
296	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:31.016753+00
297	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:31.01895+00
298	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:31.020511+00
299	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 07:26:31.023379+00
300	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:21:17.54776+00
301	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:21:28.312792+00
302	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:21:29.858641+00
303	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:21:48.299443+00
304	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:12.958215+00
305	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:12.964471+00
306	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:12.965591+00
307	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:12.971796+00
308	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:12.97202+00
309	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:12.974168+00
310	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:12.976096+00
311	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:12.977098+00
312	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:12.978293+00
313	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:12.979671+00
314	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:12.980699+00
315	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:13.013687+00
316	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:13.015673+00
317	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:13.018793+00
318	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.934889+00
319	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.93601+00
320	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.940204+00
321	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.940148+00
322	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.942891+00
323	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.948444+00
324	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.94942+00
325	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.951715+00
326	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.952604+00
327	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.955115+00
328	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.974188+00
329	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.979504+00
330	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.985205+00
331	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:21.987435+00
332	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:36.936004+00
333	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:36.936392+00
334	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:36.941439+00
335	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:36.942637+00
336	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:36.977742+00
337	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:36.979447+00
338	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:24:36.982328+00
339	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:25:08.937905+00
340	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:25:08.938207+00
341	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:25:08.940138+00
342	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:25:08.941288+00
343	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:25:08.94251+00
344	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:25:08.973915+00
345	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:25:08.976324+00
346	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:00.972338+00
347	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:00.974965+00
348	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:00.98407+00
349	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:00.984144+00
350	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:01.026943+00
351	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:01.030194+00
352	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:01.033052+00
353	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:05.939294+00
355	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:05.943857+00
360	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:31.938723+00
363	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:31.942062+00
364	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:31.977248+00
1607	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:12:03.093729+00
1609	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:12:03.098144+00
1612	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:12:03.106529+00
1613	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:12:03.131899+00
1614	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:12:03.135467+00
1615	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:12:03.137465+00
1616	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:12:03.139836+00
1617	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:12:06.987397+00
1618	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:25.942574+00
1621	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:25.946192+00
1622	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:25.949535+00
1628	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.630925+00
1631	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.636992+00
1632	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.640456+00
1635	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.6515+00
1638	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.661267+00
1640	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.668252+00
1641	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.672744+00
1642	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.67738+00
1643	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.680902+00
1644	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.682173+00
1645	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.687956+00
1646	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.692268+00
1647	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.698044+00
1648	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.815162+00
1650	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.871867+00
1653	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.891332+00
1654	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.895316+00
1656	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.898959+00
1658	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.902802+00
1665	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.920557+00
1884	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.604566+00
1999	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.842477+00
2001	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:15.96478+00
2002	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:15.969498+00
2004	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:15.979285+00
2005	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:15.982795+00
2008	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:15.997964+00
2009	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:16.003849+00
2011	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:25.921522+00
2013	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:25.934273+00
2016	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:25.956727+00
2018	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:25.962721+00
2020	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:25.990156+00
2021	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:01:08.691427+00
2023	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:05:25.933586+00
2025	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:05:25.954124+00
2026	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:05:25.960177+00
2027	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:05:25.974968+00
2028	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:05:26.000262+00
2029	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:05:26.016164+00
2031	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:05:26.04544+00
2032	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:05:33.544938+00
2033	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.025448+00
2038	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.072764+00
2039	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.074412+00
2040	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.090429+00
2042	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.105071+00
2044	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.1131+00
2046	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.120837+00
2049	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.139526+00
2050	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.144606+00
2053	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:17.918854+00
2054	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:17.924332+00
2058	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:17.945714+00
354	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:05.940475+00
356	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:05.943977+00
357	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:05.977055+00
358	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:05.979489+00
359	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:05.981269+00
361	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:31.939238+00
362	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:31.941643+00
1608	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:12:03.095014+00
1610	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:12:03.099209+00
1611	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:12:03.106302+00
1619	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:25.943144+00
1620	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:25.945764+00
1623	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:25.949875+00
1624	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:25.974115+00
1625	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:25.976628+00
1626	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:25.977512+00
1627	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:25.98134+00
1629	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.631512+00
1630	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.636416+00
1633	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.640825+00
1634	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.648623+00
1636	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.655851+00
1637	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.65963+00
1639	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:19:29.666817+00
1649	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.815205+00
1651	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.874339+00
1652	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.891184+00
1655	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.895445+00
1657	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.899008+00
1659	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.903128+00
1660	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.912724+00
1661	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.91596+00
1663	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.917593+00
1664	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.919685+00
1666	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.924018+00
1668	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.218383+00
1671	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.274931+00
1672	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.278557+00
1674	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.282318+00
1675	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.299196+00
1678	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.303727+00
1680	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.308396+00
1681	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.314319+00
1682	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.319786+00
1683	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.32242+00
1685	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.325622+00
1692	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.240446+00
1693	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.244931+00
1698	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.420436+00
1699	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.425946+00
1701	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.431939+00
1703	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.434747+00
1705	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.439066+00
1706	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.457931+00
1707	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.462467+00
1708	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.468639+00
1709	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.469443+00
1716	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.93316+00
1717	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.936597+00
1718	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.938419+00
1720	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.944371+00
1723	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.94801+00
1724	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.950923+00
1727	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.969298+00
1731	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.988428+00
1732	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.989898+00
1738	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:06.993524+00
1739	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:06.997289+00
1742	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.001977+00
1744	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.00565+00
365	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:31.984805+00
366	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:26:32.08382+00
367	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:28:53.93589+00
368	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:28:53.937881+00
369	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:28:53.940549+00
370	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:28:53.941982+00
371	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:28:53.977983+00
372	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:28:53.980013+00
373	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:28:53.982574+00
374	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.006528+00
375	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.012794+00
376	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.016843+00
377	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.019125+00
378	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.01954+00
379	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.025921+00
380	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.027019+00
381	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.033029+00
382	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.034258+00
383	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.037925+00
384	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.038431+00
385	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.04253+00
386	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.04492+00
387	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:30.072098+00
388	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:37.945072+00
389	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:37.945269+00
390	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:37.948102+00
391	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:37.948697+00
392	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:37.98103+00
393	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:37.983079+00
394	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:37.984961+00
395	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.7221+00
396	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.73057+00
397	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.735535+00
398	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.735854+00
399	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.74196+00
400	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.742338+00
401	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.749278+00
402	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.759851+00
403	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.761091+00
404	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.764102+00
405	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.767895+00
406	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.798973+00
407	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.799001+00
408	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:40.802699+00
409	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:32:42.659693+00
410	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:25.949392+00
411	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:25.950672+00
412	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:25.9524+00
413	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:25.952791+00
414	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:25.95474+00
415	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:25.987308+00
416	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:25.988789+00
417	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.416704+00
418	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.420792+00
419	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.425146+00
420	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.432335+00
421	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.432488+00
422	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.434276+00
423	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.43933+00
424	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.451576+00
425	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.45378+00
426	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.454667+00
427	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.456732+00
428	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.459037+00
429	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.493657+00
430	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:37.496042+00
431	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:38.72709+00
432	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:44.939825+00
433	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:44.940874+00
434	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:44.941903+00
435	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:44.943692+00
436	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:44.976458+00
444	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.953874+00
445	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.956256+00
447	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.957895+00
448	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.960653+00
450	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.963027+00
451	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.998343+00
452	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:11.003325+00
453	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.736266+00
454	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.741635+00
455	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.747764+00
456	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.750567+00
461	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.773268+00
463	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.775623+00
1662	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.916427+00
1667	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:20:21.928945+00
1669	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.218518+00
1670	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.274806+00
1673	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.280394+00
1676	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.299284+00
1677	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.303213+00
1679	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.308014+00
1684	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.322797+00
1686	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.325884+00
1687	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:13.333536+00
1688	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:17.15843+00
1689	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:17.163273+00
1690	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.235551+00
1691	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.240183+00
1694	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.245196+00
1695	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.274017+00
1696	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.414257+00
1697	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.419021+00
1700	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.428171+00
1702	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.43209+00
1704	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.436764+00
1710	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.471872+00
1711	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 11:21:19.474844+00
1712	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 11:24:34.279782+00
1916	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:56:55.869934+00
2010	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:16.022697+00
2012	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:25.928393+00
2014	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:25.939916+00
2015	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:25.944868+00
2017	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:25.957795+00
2019	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:00:25.985891+00
2022	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:05:25.928418+00
2024	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:05:25.935919+00
2113	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.690086+00
2115	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.695964+00
2117	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.703404+00
2118	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.708087+00
2164	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.299746+00
2165	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.326724+00
2166	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:37.977598+00
2167	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.289388+00
2169	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.308057+00
2170	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.315778+00
2173	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.351731+00
2174	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.364362+00
2177	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.375271+00
2223	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.218002+00
2311	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:28.48259+00
2312	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:28.647576+00
2314	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:28.651767+00
2316	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.099754+00
2318	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.103643+00
2319	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.108037+00
2320	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.111431+00
437	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:44.976579+00
438	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:33:44.979335+00
439	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.946226+00
440	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.947506+00
441	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.949173+00
442	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.950911+00
443	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.952846+00
446	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.957429+00
449	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:10.961605+00
457	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.752515+00
458	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.75782+00
459	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.761355+00
460	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.767339+00
462	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.773621+00
464	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.77576+00
465	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.780361+00
466	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:15.809605+00
467	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:18.143517+00
468	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:29.954985+00
469	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:29.955078+00
470	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:29.957772+00
471	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:29.958791+00
472	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:29.960651+00
473	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:30.020866+00
474	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:34:30.070414+00
475	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:36:47.949576+00
476	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:36:47.94999+00
477	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:36:47.951959+00
478	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:36:47.952288+00
479	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:36:47.984432+00
480	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:36:47.988609+00
481	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:36:47.991603+00
482	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:37:46.859787+00
483	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:37:46.862428+00
484	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:37:46.864374+00
485	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:37:46.864839+00
486	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:37:46.867373+00
487	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:37:46.868198+00
488	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:37:46.899661+00
489	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.018624+00
490	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.023139+00
491	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.028227+00
492	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.044701+00
493	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.046194+00
494	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.054867+00
495	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.05745+00
496	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.059632+00
497	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.062473+00
498	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.066897+00
499	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.067113+00
500	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.085361+00
501	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.10013+00
502	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:24.107816+00
503	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:53.943119+00
504	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:53.944299+00
505	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:53.94637+00
506	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:53.94668+00
507	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:53.977538+00
508	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:53.981538+00
509	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:53.983532+00
510	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:39:57.072282+00
511	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:40:19.43973+00
512	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 08:40:59.923987+00
513	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:41:00.00056+00
514	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:41:00.003318+00
515	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:41:05.491797+00
516	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 08:42:17.27594+00
517	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:15.874933+00
518	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:15.883703+00
519	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:15.885709+00
520	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:15.892381+00
523	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:15.909081+00
524	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:15.914736+00
525	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:15.91842+00
526	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:15.952547+00
527	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:16.048561+00
529	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:16.053264+00
535	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:33.649897+00
536	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.503178+00
537	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.510625+00
538	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.519846+00
541	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.527571+00
543	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.5341+00
545	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.541571+00
546	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.545669+00
549	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.55317+00
1713	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 12:17:46.573539+00
1714	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 12:34:10.999297+00
1715	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 12:35:12.860144+00
1719	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.939754+00
1721	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.944488+00
1722	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.947741+00
1725	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.951453+00
1726	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.964778+00
1728	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.969665+00
1729	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.985466+00
1730	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.988316+00
1733	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.99164+00
1734	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.993733+00
1735	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:19:16.996021+00
1736	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:06.989264+00
1737	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:06.992445+00
1740	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:06.997891+00
1741	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.000561+00
1743	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.004509+00
1747	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.021884+00
1748	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.02461+00
1749	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.03346+00
1750	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.034987+00
1754	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.041984+00
1755	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.043766+00
1757	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:56.974922+00
1759	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:56.985769+00
1762	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:56.989578+00
1764	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:56.992352+00
1765	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:56.996151+00
1767	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:57.000142+00
1773	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:57.031394+00
1778	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.450146+00
1780	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.462143+00
1781	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.465167+00
1783	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.469095+00
1786	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.47366+00
1787	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.477098+00
1788	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.498925+00
1920	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.283148+00
1922	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.315416+00
1923	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.326031+00
1924	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.333569+00
1926	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.353736+00
1927	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.357395+00
1928	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.359968+00
1929	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.367189+00
1931	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.383444+00
1933	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.389727+00
1934	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.392533+00
1937	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.404727+00
1938	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.533596+00
1941	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.733876+00
1943	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.748615+00
521	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:15.893982+00
522	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:15.908721+00
528	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:16.048735+00
530	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:16.053647+00
531	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:16.084626+00
532	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:16.087151+00
533	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 09:14:33.554822+00
534	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:14:33.647661+00
539	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.519957+00
540	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.526491+00
542	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.534156+00
544	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.54143+00
547	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.547506+00
548	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.55315+00
550	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.558891+00
551	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.5924+00
552	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.594483+00
553	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:16:18.597805+00
554	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.673189+00
555	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.673265+00
556	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.678593+00
557	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.679828+00
558	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.692961+00
559	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.695398+00
560	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.698722+00
561	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.700234+00
562	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.710836+00
563	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.715764+00
564	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.719356+00
565	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.721693+00
566	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.722777+00
567	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.725987+00
568	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.727716+00
569	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.731077+00
570	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.766694+00
571	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:08.769134+00
572	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.3572+00
573	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.362741+00
574	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.368592+00
575	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.368717+00
576	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.371135+00
577	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.375674+00
578	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.380841+00
579	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.385987+00
580	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.393385+00
581	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.39377+00
582	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.399218+00
583	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.403785+00
584	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.404952+00
585	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.41059+00
586	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.410711+00
587	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.446691+00
588	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.451288+00
589	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:17:56.551596+00
590	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.962979+00
591	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.963154+00
592	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.965746+00
593	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.968009+00
594	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.970053+00
595	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.974023+00
596	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.974971+00
597	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.979015+00
598	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.980974+00
599	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.988141+00
600	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.99156+00
601	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.992483+00
602	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.996777+00
603	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:01.997604+00
604	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:02.002165+00
605	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:02.003676+00
606	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:02.033825+00
607	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:02.138363+00
608	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.893632+00
609	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.893914+00
610	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.900864+00
611	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.902495+00
612	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.906156+00
613	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.912885+00
614	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.914654+00
615	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.922568+00
616	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.932921+00
617	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.936294+00
618	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.938635+00
619	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.946476+00
620	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.946401+00
621	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.967958+00
622	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.977605+00
623	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:24.995399+00
624	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:25.0063+00
625	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:24:25.012238+00
626	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 09:25:28.549507+00
627	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:25:28.632679+00
628	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:25:28.634868+00
629	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:25:35.529914+00
630	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:58.961182+00
631	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:58.97101+00
632	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:58.982354+00
633	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:58.985877+00
634	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:58.990265+00
635	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:58.994768+00
636	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:58.997447+00
637	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:59.004438+00
638	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:59.005297+00
639	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:59.010958+00
640	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:59.010924+00
641	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:59.019194+00
642	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:59.019043+00
643	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:59.027647+00
644	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:59.050569+00
645	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:59.061597+00
646	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:59.061749+00
647	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:34:59.063503+00
648	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.546325+00
649	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.553663+00
650	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.561792+00
651	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.564609+00
652	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.566465+00
653	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.571514+00
654	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.574104+00
655	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.576406+00
656	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.576769+00
657	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.580184+00
658	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.583429+00
659	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.590682+00
660	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.595967+00
661	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.597816+00
662	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.601565+00
663	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.602868+00
664	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.604774+00
665	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.643116+00
666	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.645134+00
667	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 09:59:37.649626+00
668	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.270242+00
669	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.280559+00
670	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.284567+00
671	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.288319+00
672	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.293845+00
673	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.297866+00
674	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.298213+00
675	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.302387+00
676	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.303562+00
677	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.310716+00
678	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.314144+00
679	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.319782+00
681	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.324222+00
682	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.32701+00
684	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.331053+00
685	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.366703+00
686	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.369109+00
687	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.375032+00
688	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.496893+00
689	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.502307+00
691	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.505373+00
692	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.516768+00
695	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.527559+00
701	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.563889+00
703	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.572215+00
704	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.577627+00
705	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.596679+00
706	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.5994+00
707	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.60492+00
710	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.25253+00
712	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.263401+00
714	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.281104+00
715	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.291528+00
716	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.322826+00
718	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.342665+00
720	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.349875+00
723	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.359299+00
724	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.376203+00
725	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.383416+00
726	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.388998+00
727	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.3924+00
1745	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.018023+00
1746	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.021475+00
1751	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.03656+00
1752	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.039166+00
1753	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:20:07.041188+00
1756	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:56.964977+00
1758	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:56.975032+00
1760	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:56.986764+00
1761	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:56.989422+00
1763	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:56.992451+00
1766	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:56.996234+00
1768	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:57.000425+00
1769	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:57.016473+00
1770	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:57.025216+00
1771	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:57.027885+00
1772	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:57.029301+00
1774	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:57.031877+00
1775	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:51:57.033927+00
1776	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.443129+00
1777	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.449982+00
1779	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.460905+00
1782	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.465755+00
1784	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.469671+00
1785	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.473036+00
1789	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.500182+00
1791	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.502639+00
1796	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.071676+00
1797	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.078184+00
1798	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.081354+00
1801	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.086764+00
1802	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.089895+00
1805	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.094012+00
1806	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.100626+00
1808	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.106785+00
1811	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.129783+00
1813	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.132911+00
1814	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.135922+00
680	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.322+00
683	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:32.330877+00
690	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.505319+00
693	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.519304+00
694	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.525426+00
696	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.527862+00
697	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.541077+00
698	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.549927+00
699	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.55672+00
700	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.56204+00
702	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:03:49.570413+00
708	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.244424+00
709	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.251104+00
711	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.263209+00
713	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.279926+00
717	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.330854+00
719	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.343581+00
721	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.350262+00
722	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:04:29.358351+00
728	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.419855+00
729	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.423856+00
730	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.428878+00
731	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.43087+00
732	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.435293+00
733	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.447445+00
734	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.447942+00
735	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.450167+00
736	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.454166+00
737	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.456159+00
738	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.473896+00
739	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.477889+00
740	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.479623+00
741	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.484801+00
742	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.490341+00
743	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.495413+00
744	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.531472+00
745	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.538582+00
746	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.539419+00
747	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:07:32.540794+00
748	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.130619+00
749	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.132703+00
750	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.137587+00
751	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.141118+00
752	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.147589+00
753	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.148303+00
754	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.150147+00
755	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.165715+00
756	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.166836+00
757	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.174149+00
758	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.17425+00
759	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.181639+00
760	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.181927+00
761	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.193211+00
762	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.194652+00
763	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.205031+00
764	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.208055+00
765	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.228251+00
766	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.235383+00
767	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:08:18.321988+00
768	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:26.96117+00
769	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:26.961506+00
770	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:26.966071+00
771	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:26.969898+00
772	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:26.970494+00
773	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:26.976427+00
774	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:26.977368+00
775	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:26.992256+00
776	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:26.998011+00
777	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:26.999315+00
778	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:27.005747+00
779	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:27.006359+00
782	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:27.011499+00
783	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:27.01382+00
784	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:27.017183+00
785	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:27.021466+00
1790	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.501177+00
1793	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.510534+00
1936	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:21.399392+00
2030	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:05:26.029637+00
2034	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.030218+00
2035	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.034065+00
2036	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.050473+00
2037	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.054568+00
2041	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.09957+00
2043	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.112577+00
2045	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.119711+00
2047	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.130144+00
2048	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.133664+00
2119	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.714662+00
2121	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.719606+00
2122	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.742969+00
2123	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.75152+00
2124	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:58.59604+00
2125	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.170063+00
2126	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.175516+00
2129	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.238936+00
2130	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.242312+00
2131	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.247769+00
2132	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.252689+00
2133	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.259683+00
2134	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.267058+00
2176	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.374104+00
2225	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.230994+00
2227	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.271558+00
2229	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.022604+00
2230	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.025104+00
2231	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.039822+00
2235	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.099331+00
2236	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.10401+00
2237	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.10836+00
2238	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.109425+00
2239	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.119744+00
2240	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.125327+00
2243	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.135663+00
2244	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.140332+00
2246	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.146694+00
2249	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:58.868504+00
2250	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:58.873479+00
2251	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:58.883356+00
2253	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:58.91466+00
2313	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:28.651226+00
2315	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:28.655698+00
2350	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.476801+00
2351	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.507951+00
2352	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:10.481485+00
2375	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.598085+00
2376	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.611069+00
2380	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.634356+00
2382	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.648673+00
2383	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.653069+00
2386	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.690886+00
2388	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.694599+00
2444	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:44.27588+00
2445	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:44.27789+00
2446	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:59.219794+00
2447	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:59.222864+00
2448	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:59.228599+00
2449	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:59.234625+00
2450	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:59.242763+00
2451	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:59.243388+00
780	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:27.009882+00
781	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:27.010429+00
786	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:27.028072+00
787	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:16:27.052943+00
788	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:20:31.872063+00
789	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:20:36.296363+00
790	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.083919+00
791	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.087158+00
792	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.087527+00
793	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.09446+00
794	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.095485+00
795	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.097317+00
796	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.104651+00
797	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.106743+00
798	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.107941+00
799	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.110661+00
800	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.121612+00
801	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.122908+00
802	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.126482+00
803	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.127145+00
804	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.131965+00
805	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.134176+00
806	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.135843+00
807	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.160742+00
808	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.167341+00
809	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:22:48.172199+00
810	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:54.99319+00
811	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:54.99793+00
812	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.005024+00
813	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.005637+00
814	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.014889+00
815	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.015493+00
816	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.025217+00
817	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.025708+00
818	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.038087+00
819	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.041839+00
820	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.041894+00
822	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.045914+00
821	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.046012+00
823	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.051404+00
824	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.051451+00
825	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.058244+00
826	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.069643+00
827	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.089213+00
828	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.092924+00
829	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:23:55.09353+00
830	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 10:25:03.492101+00
831	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.387462+00
832	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.391968+00
833	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.398544+00
834	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.402367+00
835	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.402373+00
836	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.407024+00
837	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.411516+00
838	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.42125+00
839	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.422102+00
840	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.427388+00
841	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.428298+00
842	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.431692+00
843	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.432605+00
844	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.435987+00
845	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.436892+00
846	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.445993+00
847	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.450095+00
848	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.450493+00
849	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.45802+00
850	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:08.461873+00
851	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:11.181824+00
852	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:14.474881+00
853	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:16.248379+00
854	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:20.46703+00
855	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:26:22.02135+00
856	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 10:27:11.163763+00
857	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-06 10:35:02.969878+00
858	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.837414+00
859	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.83886+00
860	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.843609+00
861	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.846809+00
862	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.853128+00
863	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.855068+00
864	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.862297+00
865	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.866679+00
866	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.869329+00
867	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.875146+00
868	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.877481+00
869	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.880048+00
870	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.88005+00
871	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.903152+00
872	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.906641+00
873	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.913167+00
874	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.945094+00
875	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.945213+00
876	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.951566+00
877	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:35:05.954169+00
878	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:36:16.796095+00
879	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:17.976958+00
880	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:17.978406+00
881	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:17.979446+00
882	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:17.982315+00
883	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:17.982413+00
884	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:17.985783+00
885	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:17.990779+00
886	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:17.990888+00
887	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:18.024218+00
888	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:18.026854+00
889	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:28.949412+00
890	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:28.949741+00
891	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:28.955275+00
892	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:28.956254+00
893	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:28.959005+00
894	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:28.959659+00
895	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:28.987386+00
896	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:28.991724+00
897	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:28.994536+00
898	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:28.995671+00
899	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:30.99756+00
900	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.003073+00
901	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.00634+00
902	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.008243+00
903	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.010255+00
904	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.016264+00
905	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.016404+00
906	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.025586+00
907	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.028292+00
908	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.031223+00
909	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.041172+00
910	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.041708+00
911	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.046518+00
912	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.046695+00
913	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.051157+00
914	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.052021+00
915	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.089429+00
916	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.094691+00
917	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.097385+00
918	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:31.097592+00
919	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:37:32.414866+00
920	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:35.945296+00
921	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:35.945706+00
922	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:35.9504+00
923	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:35.953329+00
924	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:35.954594+00
927	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:35.989215+00
928	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:35.992981+00
929	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:35.994756+00
932	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.235189+00
933	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.242327+00
934	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.243486+00
935	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.256083+00
939	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.271553+00
942	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.27786+00
952	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:00.946937+00
954	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:00.949973+00
956	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:00.952818+00
959	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:00.986248+00
964	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.686328+00
967	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.692496+00
968	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.695651+00
969	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.702421+00
971	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.708842+00
1792	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.509469+00
1794	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.513906+00
1795	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:53:13.532687+00
1799	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.082357+00
1800	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.086337+00
1803	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.089908+00
1804	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.093626+00
1807	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.101801+00
1809	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.107+00
1810	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.127405+00
1812	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.131037+00
1818	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.92848+00
1819	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.931687+00
1821	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.936205+00
1822	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.936938+00
1823	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.940028+00
1825	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.944883+00
1826	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.948616+00
1939	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.696202+00
1940	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.704305+00
1942	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.746698+00
1944	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.758035+00
1945	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.768611+00
1947	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.77674+00
1949	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.789068+00
1952	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.808534+00
1953	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.813849+00
1955	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.826576+00
1956	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.832643+00
2051	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.153055+00
2052	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:08:10.158689+00
2055	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:17.932011+00
2056	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:17.935325+00
2057	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:17.939922+00
2059	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:17.950435+00
2060	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:17.955224+00
2065	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.836515+00
2067	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.86232+00
2070	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.88442+00
2071	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.88766+00
2072	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.898189+00
2073	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.90085+00
2075	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.910293+00
2076	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.914567+00
2079	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.934716+00
2080	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.943012+00
2081	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.968528+00
2082	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.970811+00
2083	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:30.001949+00
2084	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.410467+00
2086	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.432317+00
925	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:35.956996+00
926	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:35.98891+00
930	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.22798+00
931	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.234105+00
936	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.256283+00
937	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.263443+00
938	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.268297+00
940	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.271558+00
941	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.277783+00
943	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.288602+00
944	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.293082+00
945	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.3012+00
946	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.304599+00
947	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.316741+00
948	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.32612+00
949	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:38.328624+00
950	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:38:40.826216+00
951	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:00.944525+00
953	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:00.947669+00
955	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:00.950099+00
957	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:00.953765+00
958	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:00.982954+00
960	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:00.992528+00
961	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:04.218236+00
962	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.673783+00
963	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.676479+00
965	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.686895+00
966	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.6909+00
970	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.703958+00
972	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.709333+00
973	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.716016+00
974	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.726746+00
975	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.730665+00
976	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.736478+00
977	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.738704+00
978	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.768778+00
979	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.772362+00
980	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.772882+00
981	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:13.777605+00
982	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:34.988381+00
983	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:35.007434+00
984	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:35.008143+00
985	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:35.012361+00
986	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:35.012965+00
987	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:35.016312+00
988	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:35.067727+00
989	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:35.089013+00
990	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:35.091997+00
991	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:35.096173+00
992	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.765558+00
993	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.771094+00
994	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.777907+00
995	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.778031+00
996	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.784274+00
997	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.784273+00
998	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.78754+00
999	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.795866+00
1000	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.800555+00
1001	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.801778+00
1002	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.806417+00
1003	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.809286+00
1004	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.812386+00
1005	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.813333+00
1006	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.819684+00
1007	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.823846+00
1008	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.833198+00
1009	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.859453+00
1010	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.863674+00
1011	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:36.868328+00
1012	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:40.716999+00
1013	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:58.946839+00
1014	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:58.948299+00
1015	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:58.952496+00
1016	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:58.952667+00
1017	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:58.955228+00
1018	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:58.956345+00
1019	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:58.988979+00
1020	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:58.992465+00
1021	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:58.992716+00
1022	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:39:58.995419+00
1023	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.254834+00
1024	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.257743+00
1025	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.26359+00
1026	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.265227+00
1027	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.271788+00
1028	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.273755+00
1029	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.273993+00
1030	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.27625+00
1031	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.283456+00
1032	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.284793+00
1033	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.288646+00
1034	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.290108+00
1035	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.292853+00
1036	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.293113+00
1037	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.295752+00
1038	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.299881+00
1039	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.303046+00
1041	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.342933+00
1040	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.342187+00
1042	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:02.346531+00
1043	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:06.891962+00
1044	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.027041+00
1045	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.033635+00
1046	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.037691+00
1047	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.040757+00
1048	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.040835+00
1049	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.098983+00
1050	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.099564+00
1051	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.110366+00
1052	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.112228+00
1053	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.126888+00
1054	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.128833+00
1055	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.132094+00
1056	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.134928+00
1057	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.139165+00
1058	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.139367+00
1059	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.142103+00
1060	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.142793+00
1061	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.149202+00
1062	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.153108+00
1063	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:52.156502+00
1064	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.165804+00
1065	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.168606+00
1066	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.173563+00
1067	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.17604+00
1068	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.178492+00
1069	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.180677+00
1070	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.186913+00
1071	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.188917+00
1072	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.19129+00
1073	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.191856+00
1074	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.199575+00
1075	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.202247+00
1076	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.207596+00
1077	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.211319+00
1078	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.211345+00
1079	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.213231+00
1080	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.21413+00
1081	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.216646+00
1082	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.217+00
1083	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:40:54.246569+00
1085	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.75204+00
1086	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.759642+00
1088	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.765633+00
1090	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.775259+00
1093	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.796413+00
1096	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.801258+00
1097	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.805756+00
1099	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.811483+00
1100	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.824172+00
1101	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.845586+00
1102	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.851303+00
1103	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.942871+00
1104	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:19.484099+00
1105	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.840785+00
1107	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.848097+00
1108	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.85451+00
1109	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.856102+00
1110	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.860532+00
1111	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.864539+00
1112	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.868448+00
1116	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.890521+00
1118	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.895881+00
1119	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.898564+00
1125	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:49.973787+00
1128	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:49.980285+00
1129	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:49.982884+00
1135	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.321154+00
1138	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.325585+00
1139	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.327841+00
1140	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.332946+00
1141	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.339866+00
1145	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.35498+00
1146	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.363419+00
1149	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.368824+00
1150	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.376014+00
1815	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:54:00.137619+00
1816	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.923951+00
1817	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.926294+00
1820	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.932874+00
1824	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.940631+00
1827	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.950509+00
1828	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.975528+00
1829	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.978531+00
1831	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.984088+00
1835	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.989756+00
1836	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.563024+00
1837	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.568307+00
1839	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.576876+00
1840	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.588619+00
1844	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.601352+00
1845	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.611839+00
1847	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.619301+00
1848	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.622966+00
1946	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.776328+00
1948	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.782717+00
1950	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.795447+00
1951	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.80273+00
1954	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.819245+00
1962	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.340642+00
1971	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.432433+00
1973	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.439983+00
2061	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:17.960003+00
2063	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.801577+00
2064	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.81073+00
2066	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.841419+00
2068	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.874897+00
2069	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.881132+00
2074	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.905644+00
2120	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.718547+00
1084	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.750203+00
1087	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.759761+00
1089	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.76567+00
1091	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.775516+00
1092	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.787043+00
1094	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.7965+00
1095	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.800352+00
1098	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:16.80768+00
1106	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.846799+00
1113	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.869586+00
1114	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.878133+00
1115	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.883448+00
1117	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.89199+00
1120	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.906284+00
1121	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.942464+00
1122	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.944741+00
1123	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:30.953691+00
1124	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:41:31.038872+00
1126	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:49.970243+00
1127	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:49.979078+00
1130	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:49.984111+00
1131	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:50.014038+00
1132	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:50.01532+00
1133	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:50.016989+00
1134	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:50.019543+00
1136	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.321692+00
1137	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.324373+00
1142	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.341854+00
1143	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.34566+00
1144	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.354656+00
1147	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.364644+00
1148	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.368432+00
1151	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.423956+00
1152	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.425823+00
1153	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.427599+00
1154	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:53.431375+00
1155	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:42:55.801658+00
1156	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.885287+00
1157	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.90311+00
1158	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.910925+00
1159	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.929439+00
1160	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.958322+00
1161	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.961999+00
1162	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.965851+00
1163	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.970708+00
1164	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.970915+00
1165	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.975538+00
1166	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.976096+00
1167	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.979574+00
1168	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.981732+00
1169	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.985138+00
1170	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.986496+00
1171	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.989485+00
1172	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:07.99953+00
1173	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:08.003562+00
1174	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:08.003677+00
1175	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:08.006572+00
1176	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:26.94058+00
1177	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:26.940665+00
1178	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:26.946076+00
1179	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:26.946654+00
1180	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:26.949304+00
1181	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:26.94983+00
1182	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:26.992704+00
1183	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:26.994517+00
1184	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:26.996623+00
1185	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:27.000685+00
1186	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:29.784021+00
1187	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:35.529334+00
1188	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:35.528218+00
1189	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:35.532816+00
1190	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:35.534446+00
1192	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:35.538243+00
1198	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:38.973549+00
1199	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:38.982229+00
1200	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:38.988815+00
1207	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:42.946163+00
1209	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:42.949839+00
1212	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:42.953984+00
1213	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:42.981949+00
1214	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:42.98543+00
1215	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:42.98865+00
1216	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:43.092692+00
1217	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:50.441631+00
1220	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:50.448837+00
1221	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:50.452653+00
1226	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:50.493831+00
1830	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.981919+00
1833	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.985747+00
1834	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.987887+00
1838	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.571247+00
1841	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.59087+00
1842	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.595798+00
1843	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.599633+00
1846	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.617352+00
1851	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.630823+00
1957	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.842546+00
2062	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:17.975466+00
2127	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.198261+00
2128	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.215709+00
2180	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.391352+00
2182	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.396704+00
2184	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.406857+00
2185	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.410635+00
2186	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.422599+00
2189	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.256727+00
2192	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.270107+00
2196	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.308214+00
2197	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.312244+00
2198	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.318104+00
2199	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.328753+00
2201	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.336135+00
2202	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.340143+00
2204	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.346087+00
2205	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.350208+00
2226	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.25431+00
2317	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.103158+00
2321	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.139153+00
2322	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.143882+00
2323	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.548522+00
2326	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.554206+00
2327	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.592132+00
2329	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.594584+00
2330	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.626037+00
2331	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:31.339607+00
2353	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.558995+00
2355	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.591719+00
2357	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.602577+00
2358	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.606016+00
2359	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.612127+00
2390	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.71189+00
2392	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.773677+00
2393	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:54.60409+00
2394	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:53:07.527575+00
2395	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:53:09.499227+00
2396	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:53:13.678796+00
2397	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:53:15.941438+00
2398	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:53:18.368545+00
2399	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:53:20.143296+00
2400	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:53:21.299586+00
1191	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:35.536491+00
1193	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:35.545499+00
1194	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:35.584674+00
1195	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:35.588212+00
1196	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:35.600049+00
1197	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:38.972467+00
1201	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:38.992014+00
1202	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:38.993758+00
1203	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:39.025099+00
1204	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:39.029867+00
1205	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:39.033953+00
1206	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:39.035484+00
1208	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:42.947495+00
1210	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:42.951092+00
1211	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:42.952723+00
1218	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:50.44453+00
1219	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:50.448785+00
1222	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:50.452877+00
1223	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:50.487377+00
1224	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:50.490766+00
1225	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:50.493344+00
1227	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:53.963972+00
1228	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:53.966034+00
1229	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:53.970492+00
1230	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:53.976206+00
1231	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:53.976461+00
1232	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:53.982633+00
1233	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:54.017391+00
1234	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:54.020528+00
1235	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:54.022895+00
1236	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:43:54.024299+00
1237	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:09.762818+00
1238	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:09.763638+00
1239	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:09.766723+00
1240	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:09.768798+00
1241	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:09.771601+00
1242	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:09.77356+00
1243	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:09.812138+00
1244	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:09.821069+00
1245	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:09.825526+00
1246	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:09.825837+00
1247	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:12.953343+00
1248	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:12.954353+00
1249	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:12.95623+00
1250	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:12.956692+00
1251	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:12.958722+00
1252	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:12.959015+00
1253	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:12.961688+00
1254	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:12.961978+00
1255	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:12.991497+00
1256	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:12.994856+00
1257	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:31.50981+00
1258	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:31.512881+00
1259	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:31.516672+00
1260	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:31.520178+00
1261	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:31.524832+00
1262	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:31.530242+00
1263	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:31.590375+00
1264	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:31.601047+00
1265	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:31.600821+00
1266	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:44:31.610776+00
1267	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:07.949745+00
1268	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:07.951467+00
1269	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:07.952996+00
1270	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:07.955275+00
1271	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:07.959923+00
1272	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:07.959961+00
1273	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:07.998064+00
1274	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:08.00094+00
1275	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:08.004222+00
1276	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:08.008645+00
1277	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.034661+00
1278	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.037698+00
1280	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.044996+00
1281	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.055054+00
1283	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.06497+00
1285	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.07415+00
1286	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.081364+00
1287	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.084248+00
1290	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.090721+00
1291	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.092679+00
1292	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.096352+00
1302	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:46:56.93747+00
1303	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:46:56.940383+00
1305	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:46:56.9438+00
1312	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:07.948085+00
1314	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:07.954655+00
1316	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:07.966908+00
1317	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:07.995676+00
1318	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:07.999909+00
1319	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:08.001867+00
1320	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:08.003871+00
1326	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.363614+00
1328	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.367485+00
1330	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.378673+00
1332	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.383531+00
1333	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.388689+00
1335	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.39375+00
1342	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:40.947274+00
1346	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:40.954335+00
1347	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:40.958668+00
1348	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:40.999071+00
1349	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:41.003011+00
1832	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:10.984536+00
1958	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:38.86641+00
1959	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:40.863157+00
1960	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.304116+00
1961	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.307608+00
1963	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.353834+00
1964	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.361828+00
1965	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.364375+00
1966	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.372763+00
1967	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.37707+00
1968	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.410497+00
1969	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.426254+00
1970	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.432176+00
1972	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.43604+00
2077	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.915768+00
2078	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:28.921404+00
2085	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.420854+00
2087	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.444736+00
2090	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.464209+00
2091	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.46824+00
2092	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.488682+00
2093	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.498321+00
2094	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.506454+00
2095	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.510616+00
2098	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.528225+00
2099	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.534982+00
2100	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.538862+00
2102	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.543175+00
2135	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.274884+00
2137	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.281094+00
2181	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.396451+00
2183	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:46.401045+00
2228	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:32.726879+00
2232	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.051021+00
2233	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.079511+00
2234	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.087702+00
2324	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.548608+00
1282	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.055752+00
1284	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.073192+00
1288	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.085588+00
1289	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.090217+00
1293	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.096653+00
1294	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.100609+00
1295	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.122505+00
1296	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.123984+00
1297	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:22.765134+00
1298	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:25.251099+00
1299	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:26.632097+00
1300	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:45:43.87644+00
1301	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:46:56.936251+00
1304	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:46:56.942219+00
1306	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:46:56.945764+00
1307	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:46:56.972312+00
1308	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:46:56.975178+00
1309	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:46:56.979034+00
1310	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:46:56.981368+00
1311	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:07.947526+00
1313	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:07.954068+00
1315	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:07.96647+00
1322	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.349678+00
1323	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.352869+00
1324	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.358275+00
1325	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.361612+00
1327	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.365621+00
1329	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.378391+00
1331	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.383437+00
1334	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.388771+00
1336	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.39409+00
1337	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.427348+00
1338	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.428562+00
1339	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.438507+00
1340	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:13.441525+00
1341	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:14.532722+00
1343	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:40.947228+00
1344	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:40.951469+00
1345	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:40.953847+00
1351	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:41.007113+00
1350	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:41.006392+00
1352	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:47:56.079313+00
1353	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.661964+00
1354	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.665392+00
1355	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.666679+00
1356	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.67664+00
1357	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.677536+00
1358	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.684128+00
1359	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.685506+00
1360	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.689126+00
1361	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.700436+00
1362	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.718651+00
1363	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.724786+00
1364	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.724866+00
1365	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.739043+00
1366	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.738528+00
1367	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.764941+00
1368	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.771237+00
1369	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.777611+00
1370	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.793533+00
1371	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.807217+00
1372	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:36.823395+00
1373	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:53.01747+00
1374	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:53.019914+00
1375	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:53.02325+00
1376	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:53.025713+00
1377	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:53.027068+00
1378	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:53.030766+00
1379	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:53.068344+00
1380	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:53.077876+00
1384	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:52:14.622782+00
1386	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:52:14.62608+00
1388	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:52:14.631041+00
1389	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:52:14.634054+00
1849	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.626077+00
1852	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.636492+00
1974	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.445924+00
1975	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.455541+00
1976	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.459027+00
1978	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.463474+00
1980	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:48.747455+00
1981	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.697059+00
1982	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.700692+00
1984	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.71371+00
1986	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.759535+00
1989	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.787161+00
2088	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.452535+00
2089	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.463136+00
2096	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.513931+00
2097	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.517432+00
2136	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.280028+00
2138	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.288604+00
2139	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.292843+00
2140	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.298794+00
2141	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.300549+00
2143	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.311487+00
2187	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.2239+00
2188	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.243074+00
2190	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.256813+00
2191	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.265933+00
2193	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.273775+00
2194	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.281503+00
2195	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.304466+00
2241	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.131313+00
2242	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.135594+00
2245	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.145527+00
2247	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.156174+00
2248	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:47.181271+00
2252	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:58.914335+00
2254	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:58.93967+00
2325	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.552584+00
2328	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:50:29.594522+00
2363	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.648743+00
2364	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.654839+00
2366	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.668775+00
2367	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.676225+00
2401	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:53:23.207814+00
2402	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:53:25.868502+00
2403	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:53:28.668277+00
2404	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:54:10.132938+00
2405	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:54:48.236365+00
2408	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:56:15.266396+00
2409	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:56:15.269949+00
2410	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:56:15.274206+00
2412	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:56:15.284685+00
2413	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:56:15.289034+00
2414	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:56:15.293662+00
2417	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:57:15.239942+00
2418	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:57:15.247384+00
2422	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:57:15.286727+00
2423	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:57:15.293232+00
2424	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:57:15.297135+00
2426	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:59:11.23154+00
2427	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:59:11.234478+00
2429	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:59:11.248519+00
2435	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:59:11.310467+00
2437	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:44.239308+00
2438	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:44.24695+00
1381	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:53.077859+00
1382	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:51:53.079034+00
1383	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:52:14.622664+00
1385	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:52:14.625004+00
1387	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:52:14.630549+00
1390	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:52:14.634661+00
1391	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:52:14.671277+00
1392	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:52:14.674356+00
1393	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:52:21.544091+00
1394	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:00.950946+00
1395	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:00.955512+00
1396	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:00.958722+00
1397	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:00.964826+00
1398	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:00.967473+00
1399	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:00.972952+00
1400	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.007777+00
1401	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.011419+00
1402	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.014721+00
1403	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.015648+00
1404	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.790172+00
1405	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.797162+00
1406	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.798509+00
1407	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.802286+00
1408	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.802817+00
1409	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.808215+00
1410	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.84125+00
1411	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.851923+00
1412	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.854492+00
1413	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:01.856981+00
1414	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.034202+00
1415	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.040004+00
1416	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.044198+00
1417	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.04527+00
1418	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.050288+00
1419	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.055001+00
1420	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.058824+00
1421	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.06349+00
1422	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.063819+00
1423	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.070859+00
1424	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.07336+00
1425	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.07722+00
1426	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.077663+00
1427	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.080938+00
1428	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.083985+00
1429	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.08834+00
1430	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.123307+00
1431	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.124222+00
1432	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.1277+00
1433	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:07.130008+00
1434	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:19.939255+00
1435	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:19.940666+00
1436	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:19.943583+00
1437	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:19.944377+00
1438	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:19.947102+00
1439	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:19.947911+00
1440	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:19.990486+00
1441	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:19.994689+00
1442	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:19.99817+00
1443	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:20.001673+00
1444	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.058762+00
1445	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.061671+00
1446	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.067789+00
1447	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.072386+00
1448	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.07267+00
1449	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.086472+00
1450	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.08658+00
1451	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.100992+00
1452	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.103665+00
1453	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.104975+00
1454	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.10767+00
1455	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.10894+00
1457	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.113004+00
1464	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:45.955152+00
1468	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:45.96102+00
1473	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:46.002532+00
1477	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.384851+00
1479	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.394433+00
1483	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.417597+00
1485	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.421669+00
1488	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.425571+00
1490	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.431627+00
1491	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.444284+00
1492	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.463409+00
1493	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.471002+00
1850	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.629087+00
1853	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.650017+00
1855	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.665953+00
1857	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:29.906709+00
1858	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:29.910361+00
1861	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:29.916296+00
1863	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:29.920896+00
1867	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:32.855464+00
1977	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.462287+00
2101	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.538967+00
2103	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:09:38.568197+00
2142	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.306547+00
2144	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:15.316309+00
2145	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:17.161242+00
2148	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.175466+00
2149	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.202941+00
2150	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.217066+00
2151	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.219956+00
2200	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.334441+00
2203	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.341735+00
2206	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:12:59.375535+00
2207	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:03.736982+00
2212	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.132973+00
2213	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.142033+00
2255	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:58.967599+00
2256	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:58.982186+00
2257	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:58.988445+00
2259	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:58.99827+00
2261	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:59.012632+00
2267	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:59.057256+00
2273	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.10295+00
2274	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.105944+00
2276	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.121157+00
2277	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.129971+00
2332	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:48.92417+00
2334	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:48.929412+00
2335	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:48.931653+00
2338	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.189424+00
2341	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.192788+00
2342	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.195808+00
2344	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.227448+00
2349	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.476747+00
2354	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.575017+00
2356	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.59658+00
2360	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.618426+00
2361	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.633919+00
2362	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.641748+00
2365	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.661385+00
2368	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.694848+00
2369	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.703219+00
2370	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.708203+00
2371	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.731462+00
2372	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:51.734588+00
2440	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:44.258447+00
2441	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:44.264468+00
2442	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:44.265418+00
1456	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.112856+00
1458	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.118842+00
1459	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.123089+00
1460	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.136799+00
1461	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.141851+00
1462	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.149209+00
1463	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:22.15944+00
1465	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:45.955271+00
1466	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:45.958334+00
1467	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:45.960731+00
1469	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:45.965024+00
1470	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:45.996336+00
1471	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:45.999587+00
1472	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:46.002351+00
1474	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.371766+00
1475	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.378399+00
1476	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.381255+00
1478	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.386419+00
1480	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.394815+00
1481	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.402663+00
1482	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.407347+00
1484	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.418942+00
1486	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.422723+00
1487	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.425528+00
1489	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:53:48.42858+00
1494	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:15.979433+00
1495	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:15.985847+00
1497	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:15.991638+00
1496	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:15.990649+00
1498	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:15.996961+00
1499	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.000806+00
1500	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.010577+00
1501	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.010806+00
1502	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.020244+00
1503	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.020383+00
1504	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.027618+00
1505	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.027685+00
1506	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.032688+00
1507	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.033043+00
1508	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.040369+00
1509	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.044641+00
1510	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.05971+00
1511	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.071211+00
1512	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.077715+00
1513	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:16.085766+00
1514	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:18.871074+00
1515	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:41.905373+00
1516	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:41.905963+00
1517	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:41.913424+00
1518	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:41.913638+00
1519	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:41.917755+00
1520	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:41.918005+00
1521	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:41.952632+00
1522	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:41.954481+00
1523	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:41.957204+00
1524	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:41.960653+00
1525	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.102816+00
1526	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.104154+00
1527	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.107794+00
1528	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.10814+00
1529	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.115973+00
1530	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.11771+00
1531	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.120816+00
1532	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.122892+00
1533	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.125696+00
1534	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.128118+00
1535	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.138041+00
1536	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.138725+00
1537	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.140731+00
1538	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.146122+00
1539	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.147335+00
1541	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.151174+00
1854	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:15.660806+00
1856	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:16.249381+00
1859	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:29.911331+00
1860	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:29.91555+00
1862	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:29.920945+00
1864	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:29.95179+00
1865	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:29.955124+00
1866	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:29.967819+00
1979	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:58:45.492814+00
2104	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.570973+00
2106	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.597029+00
2107	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.611677+00
2146	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.152704+00
2147	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.164696+00
2154	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.244696+00
2155	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.247424+00
2208	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.099048+00
2209	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.103667+00
2210	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.111116+00
2211	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.119179+00
2214	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.157815+00
2216	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.178236+00
2218	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.1965+00
2219	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.201032+00
2220	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.206196+00
2221	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.210944+00
2222	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.216901+00
2224	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.223757+00
2258	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:58.9964+00
2260	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:59.00917+00
2262	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:59.017566+00
2263	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:59.022902+00
2264	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:59.029068+00
2265	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:59.03366+00
2266	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:59.039429+00
2268	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:59.092038+00
2269	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:14:00.88368+00
2270	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.079909+00
2271	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.084699+00
2272	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.093298+00
2275	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.112472+00
2278	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.144176+00
2279	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.163101+00
2280	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.21599+00
2282	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.2203+00
2283	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.230843+00
2290	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.323457+00
2292	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.354439+00
2293	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.369031+00
2296	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.395506+00
2297	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.407731+00
2299	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.413444+00
2301	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.427009+00
2302	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.432695+00
2303	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.43679+00
2304	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.4404+00
2307	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.454088+00
2309	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.460195+00
2310	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:52.704135+00
2333	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:48.926379+00
2336	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:48.933079+00
2337	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:48.961235+00
2339	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.189534+00
2340	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.192279+00
2343	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.196983+00
2345	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.227567+00
2346	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.374829+00
2347	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.377919+00
1540	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.149375+00
1542	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.153378+00
1543	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.155014+00
1544	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:44.180736+00
1545	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 10:54:46.832769+00
1868	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.475257+00
1870	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.491151+00
1872	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:55:52.511745+00
1983	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.708013+00
1985	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.72511+00
1987	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.767082+00
1988	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 13:59:36.782482+00
2105	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.580024+00
2108	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.628585+00
2111	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.684039+00
2114	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:10:53.690818+00
2152	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.234444+00
2153	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.239704+00
2157	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.265536+00
2158	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.27022+00
2159	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.279404+00
2160	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.283496+00
2162	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:11:33.287501+00
2215	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.169788+00
2217	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:13:30.191825+00
2281	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.217565+00
2284	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.235123+00
2285	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.245687+00
2286	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.249065+00
2287	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.251902+00
2288	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.256303+00
2289	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:48.268559+00
2291	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.331483+00
2294	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.372797+00
2295	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.385861+00
2298	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.410805+00
2300	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.419418+00
2305	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.443487+00
2306	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.447991+00
2308	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-06 14:15:50.460034+00
2348	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:51:49.418249+00
2373	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.587811+00
2374	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.597476+00
2377	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.613317+00
2378	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.618479+00
2379	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.626555+00
2381	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.645501+00
2384	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.662032+00
2385	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.679835+00
2387	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.693071+00
2389	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.700083+00
2391	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:52:53.713557+00
2406	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:56:15.2485+00
2407	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:56:15.256101+00
2411	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:56:15.280588+00
2415	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:56:15.42458+00
2416	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:57:15.235446+00
2419	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:57:15.2492+00
2420	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:57:15.261322+00
2421	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:57:15.274426+00
2425	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:57:15.328503+00
2428	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:59:11.240508+00
2430	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:59:11.254945+00
2431	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:59:11.25867+00
2432	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:59:11.263782+00
2433	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:59:11.271337+00
2434	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 03:59:11.276314+00
2436	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:44.221593+00
2439	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:44.25422+00
2443	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:44.274085+00
2452	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:59.248541+00
2453	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:59.253766+00
2456	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:02.99172+00
2457	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.002646+00
2458	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.026192+00
2459	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.045444+00
2454	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:59.259102+00
2455	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:00:59.274252+00
2460	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.049562+00
2461	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.070818+00
2462	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.077974+00
2463	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.08145+00
2464	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.09014+00
2465	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.094533+00
2466	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.095348+00
2467	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.100786+00
2468	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.105924+00
2469	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.113505+00
2470	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.116832+00
2471	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.120842+00
2472	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.124004+00
2473	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.127118+00
2474	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.129509+00
2475	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.168338+00
2476	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:03.849894+00
2477	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:45.257451+00
2478	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:45.263822+00
2479	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:45.271692+00
2480	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:45.275207+00
2481	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:45.279+00
2482	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:45.284444+00
2483	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:45.289104+00
2484	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:45.29387+00
2485	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:45.31259+00
2486	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:01:45.315412+00
2487	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:22.152516+00
2488	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:22.164616+00
2489	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:22.18912+00
2490	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:22.204791+00
2491	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:22.21135+00
2492	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:22.218531+00
2493	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:22.224717+00
2494	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:22.22919+00
2495	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:22.233069+00
2496	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:22.241565+00
2497	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:48.873632+00
2498	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:48.933961+00
2500	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:49.009687+00
2499	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:48.985683+00
2501	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:49.033679+00
2502	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:49.046475+00
2503	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:49.08987+00
2504	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:49.14049+00
2505	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:49.193018+00
2506	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:02:49.22397+00
2507	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.485306+00
2508	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.487054+00
2509	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.49717+00
2510	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.50492+00
2511	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.516575+00
2512	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.521269+00
2513	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.534802+00
2514	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.545275+00
2515	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.560844+00
2516	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.584593+00
2517	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.585989+00
2518	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.591762+00
2519	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.600631+00
2520	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.601829+00
2521	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.607413+00
2522	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.614813+00
2523	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.614683+00
2524	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.620953+00
2525	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.644871+00
2526	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:15.658465+00
2527	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:03:20.443316+00
2528	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:04:10.917225+00
2529	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.849845+00
2530	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.868394+00
2531	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.874858+00
2532	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.876301+00
2533	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.88349+00
2534	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.89388+00
2535	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.894875+00
2536	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.899962+00
2537	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.90069+00
2538	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.904517+00
2539	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.904938+00
2540	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.912164+00
2541	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.912393+00
2542	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.917579+00
2543	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.918651+00
2544	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.936275+00
2545	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.947693+00
2546	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:06.952049+00
2548	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:07.304513+00
2547	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 04:38:07.30456+00
2549	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:18.967818+00
2550	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:18.970342+00
2551	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:18.984373+00
2552	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.028013+00
2553	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.046517+00
2554	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.046711+00
2555	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.049356+00
2556	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.050325+00
2557	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.05334+00
2558	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.0849+00
2559	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.08597+00
2560	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.216154+00
2561	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.216514+00
2562	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.222017+00
2563	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.228767+00
2564	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.263536+00
2565	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.273642+00
2566	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.279143+00
2567	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.467496+00
2568	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:19.469695+00
2569	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:23.302507+00
2570	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:33.306599+00
2571	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:33.318715+00
2572	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:33.331165+00
2573	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:33.447815+00
2574	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:33.554214+00
2575	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:33.554254+00
2576	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:33.566264+00
2577	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:33.954102+00
2578	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:33.954818+00
2579	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:33.959112+00
2580	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:33.967431+00
2581	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:34.002397+00
2582	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:34.076623+00
2583	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:34.088652+00
2584	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:34.096293+00
2585	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:34.113352+00
2586	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:34.215082+00
2587	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:34.217792+00
2588	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:34.256406+00
2589	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:21:34.25688+00
2590	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:23:32.008716+00
2591	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:23:32.011415+00
2592	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:23:32.017838+00
2593	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:23:32.02509+00
2594	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:23:32.029896+00
2595	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:23:32.040792+00
2596	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:23:32.051066+00
2597	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:23:32.05941+00
2598	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:23:32.066864+00
2600	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:17.221144+00
2602	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:17.236558+00
2607	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:17.268597+00
2608	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:17.270953+00
2610	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.574901+00
2612	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.591702+00
2613	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.603933+00
2614	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.619572+00
2615	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.63706+00
2616	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.641828+00
2599	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:23:32.091507+00
2601	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:17.234323+00
2603	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:17.241279+00
2604	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:17.251528+00
2605	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:17.259273+00
2606	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:17.265717+00
2609	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:17.286319+00
2611	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.58054+00
2617	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.656788+00
2618	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.662616+00
2619	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.667191+00
2621	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.678807+00
2620	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.678106+00
2622	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.684062+00
2623	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.690439+00
2624	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.699791+00
2625	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.700803+00
2626	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.71448+00
2627	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.719603+00
2628	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.748169+00
2629	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:28.751336+00
2630	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:24:30.751241+00
2631	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.352824+00
2632	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.379889+00
2633	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.401859+00
2634	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.403255+00
2635	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.403273+00
2636	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.409962+00
2637	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.417079+00
2638	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.427094+00
2639	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.437523+00
2640	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.449851+00
2641	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.455565+00
2642	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.480105+00
2643	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.488998+00
2644	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.497923+00
2645	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.509466+00
2646	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.517914+00
2647	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.525823+00
2648	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.533655+00
2649	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.537314+00
2650	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:13.569047+00
2651	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:25:30.344905+00
2652	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.343784+00
2653	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.358666+00
2654	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.369383+00
2655	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.374117+00
2656	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.388278+00
2657	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.396204+00
2658	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.397861+00
2659	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.407975+00
2660	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.41345+00
2661	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.424844+00
2662	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.429142+00
2663	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.433883+00
2665	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.440311+00
2664	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.439566+00
2666	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.445784+00
2667	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.452434+00
2668	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.460421+00
2669	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.469048+00
2670	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.471002+00
2671	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:17.476377+00
2672	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:18.83869+00
2673	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.718409+00
2674	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.732976+00
2675	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.750451+00
2676	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.762925+00
2677	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.770769+00
2678	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.779812+00
2679	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.788085+00
2682	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.813075+00
2683	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.818399+00
2684	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.833739+00
2685	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.839303+00
2687	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.846399+00
2689	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.85132+00
2695	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.000386+00
2697	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.019589+00
2698	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.043621+00
2700	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.06664+00
2680	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.805286+00
2681	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.811028+00
2686	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.84125+00
2688	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.8502+00
2690	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.858859+00
2691	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.871298+00
2692	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:25.872012+00
2693	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:26.807482+00
2694	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:54.979169+00
2696	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.005672+00
2699	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.058824+00
2701	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.068988+00
2702	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.071634+00
2703	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.074685+00
2704	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.082815+00
2705	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.090761+00
2706	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.093355+00
2707	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.094186+00
2708	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.103647+00
2709	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.122706+00
2710	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.127317+00
2711	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.127528+00
2712	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.137657+00
2713	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:55.150945+00
2714	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:26:58.507596+00
2715	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.412366+00
2716	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.432754+00
2717	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.443425+00
2718	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.451931+00
2719	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.464205+00
2720	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.468049+00
2721	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.473116+00
2722	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.485217+00
2723	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.485798+00
2724	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.488623+00
2725	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.493367+00
2726	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.495053+00
2727	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.506104+00
2728	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.512618+00
2729	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.517382+00
2730	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.525765+00
2731	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.528838+00
2732	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.537583+00
2733	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.545084+00
2734	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:27:58.554049+00
2735	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:28:00.583898+00
2736	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.088293+00
2737	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.100815+00
2738	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.118315+00
2739	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.126048+00
2740	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.126215+00
2741	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.132063+00
2742	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.140182+00
2743	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.163499+00
2744	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.190264+00
2745	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.197852+00
2746	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.201311+00
2747	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.202872+00
2748	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.214994+00
2749	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.221442+00
2750	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.225814+00
2751	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.22999+00
2752	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.235005+00
2753	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.253599+00
2754	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.255655+00
2755	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:30:56.271258+00
2756	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:31:00.242867+00
2757	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.836125+00
2758	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.852729+00
2759	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.867798+00
2760	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.880262+00
2763	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.905725+00
2769	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.960962+00
2774	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.994076+00
2775	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:27.00512+00
2776	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:27.015043+00
2777	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:29.652369+00
2779	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.240756+00
2784	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.304808+00
2785	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.317734+00
2786	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.324445+00
2761	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.890028+00
2762	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.895125+00
2764	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.930331+00
2765	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.936636+00
2766	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.942896+00
2767	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.948791+00
2768	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.953479+00
2770	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.968054+00
2771	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.970567+00
2772	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.980223+00
2773	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:26.984877+00
2778	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.229148+00
2780	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.265673+00
2781	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.284754+00
2782	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.295573+00
2783	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.3013+00
2787	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.330445+00
2788	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.339662+00
2789	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.344112+00
2790	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.35695+00
2791	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.359819+00
2792	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.366799+00
2793	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.367612+00
2794	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.3712+00
2795	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.371705+00
2796	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.375459+00
2797	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:32:54.381288+00
2798	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:33:09.632554+00
2799	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:15.272476+00
2800	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:15.285756+00
2801	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:15.333604+00
2802	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:15.339235+00
2803	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:15.37222+00
2804	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:15.373091+00
2805	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:15.381895+00
2806	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:15.392531+00
2807	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:15.395334+00
2808	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:15.423927+00
2809	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:50.926366+00
2810	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:50.948388+00
2811	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:50.958897+00
2812	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:50.965681+00
2813	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:50.971396+00
2814	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:50.976754+00
2815	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.001142+00
2816	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.008157+00
2817	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.013863+00
2818	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.021968+00
2819	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.023527+00
2820	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.027363+00
2821	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.03321+00
2822	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.044611+00
2823	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.04512+00
2824	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.05788+00
2825	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.068801+00
2826	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.073541+00
2827	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.087791+00
2828	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.171431+00
2829	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:36:51.972255+00
2830	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:03.983933+00
2831	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.000253+00
2832	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.029699+00
2833	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.040164+00
2834	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.067054+00
2835	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.070924+00
2836	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.0737+00
2837	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.080573+00
2838	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.088037+00
2839	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.087988+00
2840	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.103533+00
2841	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.105337+00
2843	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.1135+00
2842	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.108226+00
2844	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.121835+00
2845	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.130703+00
2846	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.146652+00
2847	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.147191+00
2848	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.165232+00
2849	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:04.170301+00
2850	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:37:06.09644+00
2851	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:19.232289+00
2852	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:19.238577+00
2853	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:19.256313+00
2854	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:19.261679+00
2855	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:19.266649+00
2856	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:19.270615+00
2857	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:19.282843+00
2858	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:19.286097+00
2859	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:19.287544+00
2860	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:19.392918+00
2861	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.234107+00
2862	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.247169+00
2863	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.250184+00
2864	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.259168+00
2865	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.266533+00
2866	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.270465+00
2867	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.273077+00
2868	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.287581+00
2869	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.30644+00
2870	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.344171+00
2871	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.345137+00
2872	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.350577+00
2873	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.350656+00
2874	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.356957+00
2875	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.360832+00
2876	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.364649+00
2877	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.370256+00
2878	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.374009+00
2879	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.37828+00
2880	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:23.380899+00
2881	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:39:24.301313+00
2882	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-07 05:40:10.493527+00
2883	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:40:24.726035+00
2884	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:40:24.734116+00
2885	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:40:24.758732+00
2886	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:40:24.765841+00
2887	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:40:24.771718+00
2888	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:40:24.792531+00
2889	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:40:24.796734+00
2890	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:40:24.799824+00
2891	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:40:27.335691+00
2892	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:41:52.547852+00
2893	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:41:57.446357+00
2894	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:13.220382+00
2895	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:13.226284+00
2896	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:13.2461+00
2897	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:13.264914+00
2898	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:13.267769+00
2899	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:13.271206+00
2900	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:13.295765+00
2901	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:13.306317+00
2902	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:15.470366+00
2903	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:18.604133+00
2904	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:21.77995+00
2905	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.84482+00
2906	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.853981+00
2907	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.860479+00
2908	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.872171+00
2909	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.876839+00
2910	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.893647+00
2911	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.904376+00
2912	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.908816+00
2913	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.914694+00
2917	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.939067+00
2918	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.943609+00
2920	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.953568+00
2921	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.958934+00
2922	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.966006+00
2925	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:46:13.717985+00
2930	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:46:13.764113+00
2931	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:46:13.766083+00
2940	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.189014+00
2941	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.191646+00
2942	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.19392+00
2944	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.199386+00
2948	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.215029+00
2949	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.218282+00
2952	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.237022+00
2953	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.243981+00
2954	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.249235+00
2957	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.255287+00
2961	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.763483+00
2962	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.774847+00
2964	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.800217+00
2966	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.827109+00
2969	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.837694+00
2914	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.9167+00
2915	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.928487+00
2916	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.938366+00
2919	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.947622+00
2923	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:33.978548+00
2924	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:42:34.008387+00
2926	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:46:13.721908+00
2927	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:46:13.725339+00
2928	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:46:13.761046+00
2929	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:46:13.763622+00
2932	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:46:13.76722+00
2933	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:46:19.612047+00
2934	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:49:41.703501+00
2935	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:49:43.341735+00
2936	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:49:44.325504+00
2937	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:49:45.32207+00
2938	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:49:46.478613+00
2939	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:53:08.411017+00
2943	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.196194+00
2945	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.200868+00
2946	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.207021+00
2947	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.213544+00
2950	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.219408+00
2951	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.222106+00
2955	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.249761+00
2956	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.250685+00
2958	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.255506+00
2959	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:10.279867+00
2960	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.756468+00
2963	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.786307+00
2965	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.817338+00
2967	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.830663+00
2968	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.837034+00
2970	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.841656+00
2971	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.850456+00
2972	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.852696+00
2973	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.860625+00
2974	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.862552+00
2975	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.863659+00
2976	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.864539+00
2977	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.869236+00
2978	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.873917+00
2979	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:55:50.883237+00
2980	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-07 05:57:08.345756+00
2981	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:57:45.009321+00
2982	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:57:45.039506+00
2983	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:57:46.490723+00
2984	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:58:35.274262+00
2985	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:58:58.612381+00
2986	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:59:05.84142+00
2987	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:59:50.961073+00
2988	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:59:55.121075+00
2989	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:59:56.251074+00
2990	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 05:59:57.653541+00
2991	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:00:02.906838+00
2992	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:00:05.537088+00
2993	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:00:08.280652+00
2994	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:00:09.716966+00
2995	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:00:11.136113+00
2996	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:00:13.229223+00
2997	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:00:14.214438+00
2998	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:00:15.580792+00
2999	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:00:43.105077+00
3000	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:00:57.915991+00
3001	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:17:33.442662+00
3002	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:18:14.092651+00
3003	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:18:19.851845+00
3004	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:18:21.304601+00
3005	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:19:07.899058+00
3006	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:22:19.2646+00
3007	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:24:22.192571+00
3008	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:24:49.922151+00
3009	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:26:42.198378+00
3010	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:27:31.224869+00
3011	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:28:33.462515+00
3012	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:29:14.817732+00
3013	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:30:58.848998+00
3014	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:31:54.266505+00
3015	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:31:58.797194+00
3016	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:41:09.169874+00
3017	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:42:22.788528+00
3018	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:43:11.441898+00
3019	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:43:39.100174+00
3020	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:43:53.557103+00
3021	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:43:57.911413+00
3022	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:44:00.809672+00
3023	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:50:13.092002+00
3024	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:50:16.379923+00
3025	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 06:50:41.407212+00
3026	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 07:00:37.849914+00
3027	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 07:03:13.989595+00
3028	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 07:07:23.926694+00
3029	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 07:48:26.586761+00
3030	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 07:49:23.343424+00
3031	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 07:49:29.8452+00
3032	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 08:30:59.122973+00
3033	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 08:31:38.479602+00
3034	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 08:38:46.692999+00
3035	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 08:45:25.31907+00
3036	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:20:35.652931+00
3037	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:22:00.0924+00
3038	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:24:39.696694+00
3039	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:25:15.961099+00
3040	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:25:49.783747+00
3041	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:26:58.553723+00
3042	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:28:02.519793+00
3043	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:30:17.105415+00
3044	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:35:09.191198+00
3045	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:44:19.860098+00
3046	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:48:14.944728+00
3047	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:49:22.704962+00
3048	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:50:48.50206+00
3049	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:51:35.571415+00
3050	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:52:09.331769+00
3051	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:54:01.4344+00
3052	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:55:36.392924+00
3053	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:55:51.274869+00
3054	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:56:08.299975+00
3055	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 09:56:41.177425+00
3056	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 10:14:27.239995+00
3057	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 10:14:28.211206+00
3058	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 10:18:12.144794+00
3059	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 10:20:45.98024+00
3060	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 10:21:51.09938+00
3061	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 10:32:29.693832+00
3062	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 10:35:40.465104+00
3063	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 10:35:53.969609+00
3064	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 10:36:04.753084+00
3065	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 10:37:28.659531+00
3066	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-07 10:38:07.232416+00
3067	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 10:38:12.906575+00
3068	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 11:40:45.188099+00
3069	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 11:42:28.835469+00
3070	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 11:42:37.435383+00
3071	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 11:44:13.358149+00
3072	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 11:44:46.756135+00
3073	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 11:44:56.859021+00
3074	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-07 11:50:01.302696+00
3075	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 11:50:32.401356+00
3076	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 11:50:45.04102+00
3077	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 11:52:19.567991+00
3078	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 11:52:49.451169+00
3079	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:06:32.942496+00
3080	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-07 12:07:27.741879+00
3081	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:07:33.22886+00
3082	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-07 12:08:01.467138+00
3083	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:08:04.683096+00
3084	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:08:16.563046+00
3085	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:08:46.615742+00
3086	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:09:03.636068+00
3087	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:09:12.81765+00
3088	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:10:47.959399+00
3089	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:10:59.513245+00
3090	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-07 12:11:52.552808+00
3091	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:12:00.06857+00
3092	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:12:56.827263+00
3093	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:17:02.819414+00
3094	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:19:13.294172+00
3095	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:20:48.679449+00
3096	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 12:28:24.116948+00
3097	4	live_broad_cast_by_id	 Streamer1 live_stream_broad_cast request	2025-01-07 13:52:10.861277+00
3098	4	live_stream_by_admin	 superAdmin@gmail.com create_live_stream_by_admin request	2025-01-07 14:09:57.790631+00
3114	4	update_user	superAdmin updated streamer1. 	2025-01-10 06:21:46.673223+00
\.


--
-- TOC entry 3180 (class 0 OID 16395)
-- Dependencies: 198
-- Data for Name: blocked_lists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blocked_lists (user_id, blocked_user_id, blocked_at) FROM stdin;
\.


--
-- TOC entry 3209 (class 0 OID 24579)
-- Dependencies: 227
-- Data for Name: bookmarks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookmarks (id, user_id, stream_id, created_at, updated_at) FROM stdin;
2	3	47	2025-01-12 06:17:12.033981+00	2025-01-12 06:17:12.033981+00
\.


--
-- TOC entry 3182 (class 0 OID 16401)
-- Dependencies: 200
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
1	sport	2024-12-18 07:22:40.136343+00	2024-12-18 07:22:40.136343+00	1	1
2	game	2024-12-18 07:22:47.001646+00	2024-12-18 07:22:47.001646+00	1	1
3	music	2024-12-18 07:23:26.302278+00	2024-12-18 07:23:26.302278+00	1	1
4	coding	2024-12-18 07:23:36.484923+00	2024-12-18 07:23:36.484923+00	1	1
5	dropgame	2025-01-08 06:28:16.576414+00	2025-01-08 06:28:16.576414+00	1	1
\.


--
-- TOC entry 3184 (class 0 OID 16409)
-- Dependencies: 202
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, user_id, stream_id, comment, created_at, updated_at) FROM stdin;
1	4	5	Nice live strange	2024-12-16 07:36:12.739227+00	2024-12-31 11:13:02.6775+00
2	5	5	Nice live too	2024-12-16 07:36:39.159826+00	2024-12-31 11:13:02.6775+00
3	4	5	show equiments	2024-12-17 09:28:33.744458+00	2024-12-31 11:13:02.6775+00
4	4	20	show equiments	2024-12-18 13:13:39.965528+00	2024-12-31 11:13:02.6775+00
5	5	37	show equiments	2024-12-19 11:56:56.5058+00	2024-12-31 11:13:02.6775+00
6	4	37	la u sar	2024-12-19 11:57:28.096256+00	2024-12-31 11:13:02.6775+00
7	4	37	hgg	2024-12-19 11:58:38.140832+00	2024-12-31 11:13:02.6775+00
8	4	24	dsv	2025-01-10 11:57:32.31+00	2024-12-31 11:13:02.6775+00
\.


--
-- TOC entry 3186 (class 0 OID 16420)
-- Dependencies: 204
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.likes (id, user_id, stream_id, like_emote, created_at, updated_at) FROM stdin;
15	4	37	like	2025-01-10 11:57:32.31+00	2024-12-19 11:57:32.31019+00
14	4	23	wow	2025-01-10 11:57:32.31+00	2024-12-18 14:02:28.353448+00
10	4	5	sad	2025-01-10 11:57:32.31+00	2024-12-18 12:07:08.183631+00
9	5	5	wow	2025-01-10 11:57:32.31+00	2024-12-18 12:07:08.183631+00
18	4	39	heart	2025-01-10 11:57:32.31+00	2024-12-19 12:13:15.358338+00
19	4	41	like	2025-01-10 11:57:32.31+00	2024-12-19 12:40:18.925389+00
20	4	42	like	2025-01-10 11:57:32.31+00	2024-12-19 12:41:44.173221+00
17	4	24	like	2025-01-10 11:57:32.31+00	2024-12-19 12:11:48.300062+00
\.


--
-- TOC entry 3188 (class 0 OID 16428)
-- Dependencies: 206
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, stream_id, content, created_at, type, read_at, hidden_at) FROM stdin;
\.


--
-- TOC entry 3190 (class 0 OID 16438)
-- Dependencies: 208
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, type, description, created_at, updated_at) FROM stdin;
1	super_admin	super_admin role	2024-12-10 06:29:33.98057+00	2024-12-10 06:29:33.98057+00
2	admin	Administrator role	2024-12-10 06:29:33.983592+00	2024-12-10 06:29:33.983592+00
3	streamer	Streamer role	2024-12-10 06:29:33.986164+00	2024-12-10 06:29:33.986164+00
4	user	Default user role	2024-12-10 06:29:33.989687+00	2024-12-10 06:29:33.989687+00
\.


--
-- TOC entry 3191 (class 0 OID 16447)
-- Dependencies: 209
-- Data for Name: schedule_streams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_streams (id, scheduled_at, stream_id, video_name, created_at, updated_at) FROM stdin;
2	2024-12-28 17:00:00+00	48	4_1735309915425825300.mp4	2024-12-27 14:31:55.430469+00	2024-12-27 14:31:55.430469+00
3	2024-12-28 17:00:00+00	49	4_1735309993634199400.mp4	2024-12-27 14:33:13.639132+00	2024-12-27 14:33:13.639132+00
4	2024-12-28 17:00:00+00	50	4_1735383350732120400.mp4	2024-12-28 10:55:50.735596+00	2024-12-28 10:55:50.735596+00
5	2024-12-29 17:00:00+00	51	4_1735383443395190400.mp4	2024-12-28 10:57:23.398319+00	2024-12-28 10:57:23.398319+00
6	2025-01-05 02:03:00+00	52	4_1735891736913398800.mp4	2025-01-03 08:08:56.917482+00	2025-01-03 08:08:56.917482+00
7	2025-01-08 14:00:00+00	53	4_1736141557715119000.mp4	2025-01-06 05:32:37.717894+00	2025-01-06 05:32:37.717894+00
8	2025-01-07 02:02:00+00	54	4_1736152859915359800.mp4	2025-01-06 08:40:59.91909+00	2025-01-06 08:40:59.91909+00
9	2025-01-07 16:01:00+00	55	4_1736154873544370000.mp4	2025-01-06 09:14:33.549378+00	2025-01-06 09:14:33.549378+00
10	2025-01-07 03:03:00+00	56	4_1736155528543026300.mp4	2025-01-06 09:25:28.546228+00	2025-01-06 09:25:28.546228+00
11	2025-01-07 02:03:00+00	57	4_1736159103486161600.mp4	2025-01-06 10:25:03.489335+00	2025-01-06 10:25:03.489335+00
12	2025-01-08 03:00:00+00	58	4_1736159231157551800.mp4	2025-01-06 10:27:11.160699+00	2025-01-06 10:27:11.160699+00
13	2025-01-07 15:02:00+00	59	4_1736159702962340600.mp4	2025-01-06 10:35:02.966584+00	2025-01-06 10:35:02.966584+00
14	2025-01-07 06:03:00+00	60	4_1736162674273518200.mp4	2025-01-06 11:24:34.276115+00	2025-01-06 11:24:34.276115+00
15	2025-01-07 22:05:00+00	61	4_1736165866563732900.mp4	2025-01-06 12:17:46.567572+00	2025-01-06 12:17:46.567572+00
16	2025-01-07 02:03:00+00	62	4_1736166850991822300.mp4	2025-01-06 12:34:10.995246+00	2025-01-06 12:34:10.995246+00
17	2025-01-07 13:04:00+00	63	4_1736166912853764200.mp4	2025-01-06 12:35:12.856788+00	2025-01-06 12:35:12.856788+00
18	2025-01-08 15:00:00+00	64	4_1736228410483809500.mp4	2025-01-07 05:40:10.487966+00	2025-01-07 05:40:10.487966+00
19	2025-01-08 17:00:00+00	65	4_1736229428336860500.mp4	2025-01-07 05:57:08.342984+00	2025-01-07 05:57:08.342984+00
20	2025-01-09 02:00:00+00	66	4_1736246287225291000.mp4	2025-01-07 10:38:07.229029+00	2025-01-07 10:38:07.229029+00
21	2025-01-07 17:00:00+00	67	4_1736250601295948600.mp4	2025-01-07 11:50:01.30027+00	2025-01-07 11:50:01.30027+00
22	2025-01-08 17:00:00+00	68	4_1736251647734389000.mp4	2025-01-07 12:07:27.739709+00	2025-01-07 12:07:27.739709+00
23	2025-01-07 17:00:00+00	69	4_1736251681461770600.mp4	2025-01-07 12:08:01.465502+00	2025-01-07 12:08:01.465502+00
24	2025-01-08 02:00:00+00	70	4_1736251912547151200.mp4	2025-01-07 12:11:52.550592+00	2025-01-07 12:11:52.550592+00
25	2025-01-07 22:04:05.999+00	71	4_1736258997730920300.movie	2025-01-07 14:09:57.753702+00	2025-01-07 14:09:57.753702+00
1	2025-01-10 22:04:05.999+00	47	1_1736430122582330500.mp4	2024-12-27 14:27:52.209888+00	2025-01-09 13:43:19.876212+00
\.


--
-- TOC entry 3194 (class 0 OID 16459)
-- Dependencies: 212
-- Data for Name: shares; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shares (id, user_id, stream_id, created_at, updated_at) FROM stdin;
1	15	45	2025-01-19 10:44:18.172983+00	2025-01-19 10:44:18.172983+00
2	18	46	2025-01-19 10:44:39.349985+00	2025-01-19 10:44:39.349985+00
\.


--
-- TOC entry 3196 (class 0 OID 16466)
-- Dependencies: 214
-- Data for Name: stream_analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stream_analytics (id, stream_id, views, likes, comments, video_size, created_at, updated_at, duration, shares) FROM stdin;
1	20	0	0	0	0	2024-12-18 13:12:52.137877+00	2024-12-18 13:12:52.137877+00	0	0
10	29	0	0	0	0	2024-12-19 06:17:49.955402+00	2024-12-19 06:17:49.955402+00	0	0
2	21	0	0	0	0	2024-12-18 13:19:43.088641+00	2024-12-18 13:19:43.088641+00	0	123
3	22	0	0	0	0	2024-12-18 13:55:50.101747+00	2024-12-18 13:55:50.101747+00	0	1
4	23	0	0	0	0	2024-12-18 14:01:41.723357+00	2024-12-18 14:01:41.723357+00	0	123
5	24	0	0	0	0	2024-12-18 14:11:14.561356+00	2024-12-18 14:11:14.561356+00	0	123
6	25	0	0	0	0	2024-12-18 14:12:18.725043+00	2024-12-18 14:12:18.725043+00	0	1
7	26	0	0	0	0	2024-12-18 14:14:45.665523+00	2024-12-18 14:14:45.665523+00	0	22
8	27	0	0	0	0	2024-12-19 05:25:52.242347+00	2024-12-19 05:25:52.242347+00	0	1
9	28	0	0	0	0	2024-12-19 05:32:04.942422+00	2024-12-19 05:32:04.942422+00	0	11
11	30	0	0	0	0	2024-12-19 06:19:54.89225+00	2024-12-19 06:19:54.89225+00	0	33
12	31	0	0	0	0	2024-12-19 06:20:58.330368+00	2024-12-19 06:20:58.330368+00	0	4
13	32	0	0	0	0	2024-12-19 08:17:40.961633+00	2024-12-19 08:17:40.961633+00	0	55
14	35	1	0	0	0	2024-12-19 11:51:53.826131+00	2024-12-19 11:52:42.923247+00	48874574	44
15	36	1	0	0	0	2024-12-19 11:53:02.435492+00	2024-12-19 11:53:27.141777+00	24556456	8
16	37	2	1	3	14210193	2024-12-19 11:56:18.652009+00	2024-12-19 11:59:05.491362+00	164967000	7
17	38	1	1	1	380554	2024-12-19 12:11:43.798929+00	2024-12-19 12:11:55.202784+00	6480000	6
18	39	1	1	0	35375154	2024-12-19 12:13:10.822811+00	2024-12-19 12:21:04.813125+00	469200000	7
19	40	1	0	0	625131	2024-12-19 12:36:35.139277+00	2024-12-19 12:36:50.364791+00	11820000	7
20	41	1	1	0	387161	2024-12-19 12:40:14.934329+00	2024-12-19 12:40:22.361943+00	4564000	7
21	42	1	1	0	8449388	2024-12-19 12:41:40.372934+00	2024-12-19 12:43:38.076407+00	114834000	8
22	43	2	0	0	0	2024-12-20 07:04:30.333341+00	2024-12-20 07:06:19.352573+00	108913289	7
23	44	2	0	0	0	2024-12-20 07:06:46.537155+00	2024-12-20 07:07:13.506679+00	26901246	5
24	45	2	0	0	0	2024-12-20 07:18:19.492534+00	2024-12-20 07:18:32.065782+00	12420602	2
25	46	2	0	0	0	2024-12-20 13:37:01.340663+00	2024-12-20 13:41:01.299349+00	239809194	5
\.


--
-- TOC entry 3197 (class 0 OID 16473)
-- Dependencies: 215
-- Data for Name: stream_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stream_categories (category_id, stream_id, created_at) FROM stdin;
2	10	2024-12-18 07:24:02.473513+00
4	10	2024-12-18 07:24:02.473513+00
1	10	2024-12-18 07:24:02.473513+00
2	11	2024-12-18 07:51:35.817314+00
4	11	2024-12-18 07:51:35.817314+00
1	11	2024-12-18 07:51:35.817314+00
2	12	2024-12-18 07:58:04.790662+00
4	12	2024-12-18 07:58:04.790662+00
2	13	2024-12-18 08:00:19.816685+00
4	13	2024-12-18 08:00:19.816685+00
2	14	2024-12-18 09:40:48.68607+00
4	14	2024-12-18 09:40:48.68607+00
2	15	2024-12-18 09:46:57.044239+00
4	15	2024-12-18 09:46:57.044239+00
2	16	2024-12-18 09:49:00.724155+00
4	16	2024-12-18 09:49:00.724155+00
2	17	2024-12-18 09:50:35.791531+00
4	17	2024-12-18 09:50:35.791531+00
2	18	2024-12-18 10:09:41.55521+00
4	18	2024-12-18 10:09:41.55521+00
2	19	2024-12-18 10:36:36.444117+00
4	19	2024-12-18 10:36:36.444117+00
2	20	2024-12-18 13:12:44.447616+00
4	20	2024-12-18 13:12:44.447616+00
2	21	2024-12-18 13:19:36.338442+00
4	21	2024-12-18 13:19:36.338442+00
2	22	2024-12-18 13:55:44.50443+00
4	22	2024-12-18 13:55:44.50443+00
2	23	2024-12-18 14:01:35.011169+00
4	23	2024-12-18 14:01:35.011169+00
2	24	2024-12-18 14:11:09.852366+00
4	24	2024-12-18 14:11:09.852366+00
2	25	2024-12-18 14:12:12.770732+00
4	25	2024-12-18 14:12:12.770732+00
2	26	2024-12-18 14:14:36.159546+00
4	26	2024-12-18 14:14:36.159546+00
2	27	2024-12-19 05:25:42.10963+00
4	27	2024-12-19 05:25:42.10963+00
2	28	2024-12-19 05:31:57.18652+00
4	28	2024-12-19 05:31:57.18652+00
2	29	2024-12-19 06:17:42.255214+00
4	29	2024-12-19 06:17:42.255214+00
2	30	2024-12-19 06:19:48.94961+00
4	30	2024-12-19 06:19:48.94961+00
2	31	2024-12-19 06:20:51.295707+00
4	31	2024-12-19 06:20:51.295707+00
2	32	2024-12-19 08:17:34.122523+00
4	32	2024-12-19 08:17:34.122523+00
4	33	2024-12-19 11:44:25.938705+00
3	33	2024-12-19 11:44:25.938705+00
2	33	2024-12-19 11:44:25.938705+00
2	34	2024-12-19 11:49:07.961522+00
2	35	2024-12-19 11:51:53.721115+00
3	36	2024-12-19 11:53:02.374349+00
2	37	2024-12-19 11:56:18.576778+00
4	38	2024-12-19 12:11:43.728227+00
2	38	2024-12-19 12:11:43.728227+00
3	38	2024-12-19 12:11:43.728227+00
2	39	2024-12-19 12:13:10.764483+00
2	40	2024-12-19 12:36:35.108727+00
2	41	2024-12-19 12:40:14.875973+00
2	42	2024-12-19 12:41:40.32291+00
2	43	2024-12-20 07:03:57.223324+00
4	43	2024-12-20 07:03:57.223324+00
2	44	2024-12-20 07:06:39.413014+00
4	44	2024-12-20 07:06:39.413014+00
2	45	2024-12-20 07:18:15.188317+00
4	45	2024-12-20 07:18:15.188317+00
2	46	2024-12-20 13:36:54.306566+00
4	46	2024-12-20 13:36:54.306566+00
2	47	2024-12-27 14:27:52.209888+00
3	48	2024-12-27 14:31:55.430469+00
4	49	2024-12-27 14:33:13.639132+00
2	50	2024-12-28 10:55:50.735596+00
4	51	2024-12-28 10:57:23.398319+00
4	52	2025-01-03 08:08:56.917482+00
1	52	2025-01-03 08:08:56.917482+00
2	52	2025-01-03 08:08:56.917482+00
1	53	2025-01-06 05:32:37.717894+00
4	53	2025-01-06 05:32:37.717894+00
2	54	2025-01-06 08:40:59.91909+00
1	54	2025-01-06 08:40:59.91909+00
2	55	2025-01-06 09:14:33.549378+00
1	55	2025-01-06 09:14:33.549378+00
3	56	2025-01-06 09:25:28.546228+00
2	56	2025-01-06 09:25:28.546228+00
2	57	2025-01-06 10:25:03.489335+00
4	57	2025-01-06 10:25:03.489335+00
1	58	2025-01-06 10:27:11.160699+00
3	58	2025-01-06 10:27:11.160699+00
3	59	2025-01-06 10:35:02.966584+00
1	59	2025-01-06 10:35:02.966584+00
2	60	2025-01-06 11:24:34.276115+00
3	60	2025-01-06 11:24:34.276115+00
2	61	2025-01-06 12:17:46.567572+00
3	62	2025-01-06 12:34:10.995246+00
4	62	2025-01-06 12:34:10.995246+00
4	63	2025-01-06 12:35:12.856788+00
2	64	2025-01-07 05:40:10.487966+00
1	64	2025-01-07 05:40:10.487966+00
4	65	2025-01-07 05:57:08.342984+00
3	65	2025-01-07 05:57:08.342984+00
2	66	2025-01-07 10:38:07.229029+00
1	67	2025-01-07 11:50:01.30027+00
4	68	2025-01-07 12:07:27.739709+00
3	69	2025-01-07 12:08:01.465502+00
1	70	2025-01-07 12:11:52.550592+00
1	71	2025-01-07 14:09:57.753702+00
\.


--
-- TOC entry 3199 (class 0 OID 16479)
-- Dependencies: 217
-- Data for Name: streams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.streams (id, user_id, title, description, status, stream_token, stream_key, stream_type, thumbnail_file_name, started_at, ended_at, created_at, updated_at) FROM stdin;
21	4	Th 10 attack	Th10 max attack	started	5fSSgcyvwuxejQBC4LYwWYgpgyqXUd4HYL6JIgc1d0CNx9wK	5e0954d1-db54-4a82-83c7-7f97012d3451	camera	4_1734527976330867722.jpeg	2024-12-18 13:19:43.08024+00	\N	2024-12-18 13:19:36.338442+00	2024-12-18 13:19:43.080523+00
31	4	Th 10 attack	Th10 max attack	ended	LHnXAcIiI8AGRXMKDamnbVJel061M2x88VCY9uJQJHkUIIFD	a47332a3-2d3f-4c56-8844-61c1d4904743	camera	4_1734589251272792473.jpeg	2024-12-19 06:20:58.326762+00	2024-12-19 06:21:01.670803+00	2024-12-19 06:20:51.295707+00	2024-12-19 06:21:01.671634+00
29	4	Th 10 attack	Th10 max attack	ended	X3obnA7tDJq8ECVpqyRdcMNrNkN46jldv7JowYwnFgcetPU9	737f7a80-6107-4250-8723-cf7379270297	camera	4_1734589062220536755.jpeg	2024-12-19 06:17:49.944438+00	2024-12-19 06:17:57.752431+00	2024-12-19 06:17:42.255214+00	2024-12-19 06:17:57.753691+00
34	4	dfvd	kdlvnfkbnkbfjk	pending	E2nOPmERl2LrNkELLczaKJLYGZUeB82vqw348OkpsdFOkxgw	859307d9-72a8-4e6d-b491-8251b4d00798	camera	4_1734608947949313482.jpeg	\N	\N	2024-12-19 11:49:07.961522+00	2024-12-19 11:49:07.961522+00
30	4	Th 10 attack	Th10 max attack	ended	QZ1Copdtg01PJIhdrqAXoaEirWqNjeQmhp9beXTcIKPOePzD	cf80a473-71bc-4c99-a85f-63f4869201f4	camera	4_1734589188917418991.jpeg	2024-12-19 06:19:54.885562+00	2024-12-19 06:19:56.632965+00	2024-12-19 06:19:48.94961+00	2024-12-19 06:19:56.63433+00
32	4	Th 10 attack	Th10 max attack	ended	DkMynLrlJgIsPCiUMKwN02nRaxoEmH3e2CDzftYTNKKrTURx	b1bb25e3-1ac7-4b71-a168-4cb51bf9b9c5	camera	4_1734596254078433828.jpeg	2024-12-19 08:17:40.957572+00	2024-12-19 08:18:33.788261+00	2024-12-19 08:17:34.122523+00	2024-12-19 08:18:33.789756+00
33	4	LOPP	fdkbngf	pending	1JTgULq4vgIjgAFf4pGRdmO1VFl7DmzCDfvFggr3ru0Gkvsd	9f966ecc-7f5b-4764-9650-eff2b3f814c3	camera	4_1734608665912833374.jpeg	\N	\N	2024-12-19 11:44:25.938705+00	2024-12-19 11:44:25.938705+00
35	4	gfgbf	vdvdf	ended	WI0UKtIGWpQzf2buaqs4CzceytzSdk0pzXC8iSkyjTNK4Lm3	13ed9540-f1b5-4019-9a1d-f8f3c7fef3fc	camera	4_1734609113705988247.jpeg	2024-12-19 11:51:53.813115+00	2024-12-19 11:52:42.68769+00	2024-12-19 11:51:53.721115+00	2024-12-19 11:52:42.690725+00
36	4	vfvf	vdfvdv	ended	cuYBwoKxJweXEPvg0xIlkVCscYp9Visq3JKmMMwGyMBi3TOF	a842ed11-0043-45a6-981b-5c4a79c61965	camera	4_1734609182365051206.jpeg	2024-12-19 11:53:02.420989+00	2024-12-19 11:53:26.977445+00	2024-12-19 11:53:02.374349+00	2024-12-19 11:53:26.97851+00
37	4	fdfd	fdgbf	ended	2HV41H5oHlJDhxkvXJgNppmyCR6NsVF45KxJs2R2YNucRmTd	b1f7907b-85e9-45a7-9cf0-1965b459d3fb	camera	4_1734609378545014525.jpeg	2024-12-19 11:56:18.64351+00	2024-12-19 11:59:05.201459+00	2024-12-19 11:56:18.576778+00	2024-12-19 11:59:05.208019+00
38	4	sdcsvfd	vfdvfd	ended	nE9bx7n4yQAs8pqaUDn53AyiS32UU3Lz98jwrZrVPEXraZEU	334b5070-f1a8-44e0-83ac-6b705aec6bfe	camera	4_1734610303723878771.jpeg	2024-12-19 12:11:43.787683+00	2024-12-19 12:11:54.96572+00	2024-12-19 12:11:43.728227+00	2024-12-19 12:11:54.966883+00
39	4	fvdv	vdfv	ended	hlheIoLLMclI7D6f9MxtDE61rVTM3VdW0pWSV5YXMRwYFPNX	3158faf8-ebee-48c6-8024-98d71f30912f	camera	4_1734610390762656122.jpeg	2024-12-19 12:13:10.810788+00	2024-12-19 12:21:04.617002+00	2024-12-19 12:13:10.764483+00	2024-12-19 12:21:04.618365+00
1	4	Th 10 attack	Th10 max attack	pending	7idvDcaC2zVKfG34BuHnK6MJOdcr5dwzVlpMSz5th6MUzSXv	7df8567c-46d9-4b40-8c2f-768a04953fc5	camera	1733836476259050690	2024-12-16 07:11:01.697716+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
16	4	Th 10 attack	Th10 max attack	started	xbt6IhkkRbK6zY3J9jIMSKsW5j4cH06whszh6VnNQcUvfZJx	3ce4299e-4329-4ed4-9b17-f22eb9409b29	camera	4_1734515340689882547.jpeg	2024-12-18 09:49:13.680099+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
3	4	Th 10 attack	Th10 max attack	pending	IPdeoN8iMPpewdzJqDu4lMv4z0ti1m8uz73z0YQLFVLPXPxJ	33c23262-58b4-4fdb-9a76-c58f9fd714c4	camera	1734245370736564357.jpeg	\N	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
4	4	Th 10 attack	Th10 max attack	pending	Fz7duRu01YjMyG1R83DaPQ6UWdwsqWuXFWXRUKGf9uhwdo7q	3d86366f-2b1d-4318-ae8b-87c5aeee5af6	camera	4_1734245452105995867.jpeg	\N	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
17	4	Th 10 attack	Th10 max attack	started	C3QSJ3XSk4Apz1aHLCCxyhF4HRfehVgtEo7wvRuQWaeJVvVd	6bc3322b-9271-4430-86bd-d1abbbc53d6e	camera	4_1734515435764740367.jpeg	2024-12-18 09:50:45.219715+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
18	4	Th 10 attack	Th10 max attack	started	jgWQdze6kM4DifsmCdLsYa0Knv2p0VaVUn67NZUrtk3lbri8	f3ce35ec-38f3-443a-a236-7f2b9399482b	camera	4_1734516581525163787.jpeg	2024-12-18 10:09:52.80385+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
23	4	Th 10 attack	Th10 max attack	started	HIHyKX6e1MCxfGZgrQd86wM1iYE9B8OTmGGVJtWKF7TNUV0I	39b11dbd-494f-4b87-802e-c8f725f6c964	camera	4_1734530495009239444.jpeg	2024-12-18 14:01:41.715133+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 14:01:41.715969+00
24	4	Th 10 attack	Th10 max attack	started	JcGl7MiRx5zrysx0HJhG0OOWJjeJQkJTOf5JFmMhhKjme8Ra	eb622951-d711-46e6-b816-1d8075beb23d	camera	4_1734531069843921849.jpeg	2024-12-18 14:11:14.558762+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 14:11:14.559007+00
25	4	Th 10 attack	Th10 max attack	started	dRNhNZBYPhb88YTzoLNeIMHWv4J4KS7mddQS0WlIRIFv9vHl	e1d0ecbc-950d-4a54-b0f2-e26623cbb443	camera	4_1734531132769201263.jpeg	2024-12-18 14:12:18.722678+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 14:12:18.72311+00
5	4	Th 10 attack	Th10 max attack	started	zHwXxgRiHsTMvVOVFb410n5TcKM2yAPk1oiTdmJ5nMJl3pmc	5faa038b-83f6-44de-a400-b81fc0ee65e8	camera	4_1734245513251150089.jpeg	2024-12-17 09:27:50.649689+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
10	4	Th 10 attack	Th10 max attack	pending	51QVzA0niR1MdmeLpwzJyE5DRXBeIl5hxhP8Nj7wgdi3n1k9	38e0be5c-9907-4ab5-b496-c9109d202f32	camera	4_1734506642455040796.jpeg	\N	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
11	4	Th 10 attack	Th10 max attack	pending	LLJtVmmh5lcwnqHmDxHjXErvBD0o0SfLvCxVuMXcqzG0yZFi	165c39aa-693a-41f2-a5f5-7e854ce85aa0	camera	4_1734508295816080016.jpeg	\N	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
12	4	Th 10 attack	Th10 max attack	started	Bmx2at7i8KOeMqNa8tfluZDi2YS1P7VfS4TLVYkBFUCHxtMW	f2b3e684-cafb-4767-810e-f7e7cdf93b15	camera	4_1734508684759528961.jpeg	2024-12-18 07:58:21.090667+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
13	4	Th 10 attack	Th10 max attack	started	j1wbZJzfXk6MzIOcOa3ODdFDxr4ikPQZctXvIH58MMgunUNx	70d08b46-bdaa-4b0b-be0c-aa79111a8ce9	camera	4_1734508819797939616.jpeg	2024-12-18 08:00:27.66555+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
14	4	Th 10 attack	Th10 max attack	started	ytE4WRil1nYybCs7onCji3UgtOmhUbsUoSS1JVjxnTgEoZ5e	a60b1e40-8622-47d1-95ff-10e0eb30ebe7	camera	4_1734514848644714656.jpeg	2024-12-18 09:41:34.743573+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
15	4	Th 10 attack	Th10 max attack	started	YjujxBVULmxzLjJMXHkgLq3YdzJvBioLzAcL9iTwpUTuaSR3	0edac089-dc30-4196-b175-0f269c779dbc	camera	4_1734515217021729895.jpeg	2024-12-18 09:47:06.297489+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
26	4	Th 10 attack	Th10 max attack	started	3C4u4wDaZmdBKCWIJLSYwik3V4Pnlk7oxaahb6CKenDvRnCU	63344993-8b4a-409b-ab9b-6dba3445743f	camera	4_1734531276157952037.jpeg	2024-12-18 14:14:45.656907+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 14:14:45.657634+00
27	4	Th 10 attack	Th10 max attack	started	wSq4M3u7pxRHllP7dH1q5wGuLdahjDuQKMA3oQnDbhoIgsF8	f8f6fa67-cdc1-458c-b8f4-e98fa1b66222	camera	4_1734585942086211286.jpeg	2024-12-19 05:25:52.235932+00	\N	2025-01-10 11:57:32.31+00	2024-12-19 05:25:52.237019+00
19	4	Th 10 attack	Th10 max attack	ended	CDpT1BhdnGNuvVM5B1D2XbNTaq9J72fPqq0SAV08SQqzDlqo	49fb432c-4474-4298-9e85-9c75e5b5ecba	camera	4_1734518196430633358.jpeg	2024-12-18 11:06:11.653159+00	2024-12-18 11:06:14.545977+00	2025-01-10 11:57:32.31+00	2024-12-18 12:07:07.699617+00
28	4	Th 10 attack	Th10 max attack	started	V7aMFLqojLqhhVdEPzbwYpuvquTcBJczrshac6IEY5eSwP4g	fdc41b9b-e12b-4026-bd88-0090b3eee70d	camera	4_1734586317179352977.jpeg	2024-12-19 05:32:04.934972+00	\N	2025-01-10 11:57:32.31+00	2024-12-19 05:32:04.936816+00
22	4	Th 10 attack	Th10 max attack	started	V9Ghp087TyqrU79bbgCxPB073CIsxAv0kKikk6drS9kPP724	2dae5359-582a-477a-b12e-f2fed74e5442	camera	4_1734530144502808252.jpeg	2024-12-18 13:55:50.098738+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 13:55:50.099343+00
40	4	dvfd	scdsv	ended	G4ywfYOIXo2kaDbjdoyyxykIy1l1HzzSdoqtStlsDK279Srd	090a7fd6-bff2-4176-a212-aa3282bd7fe2	camera	4_1734611795100579363.jpeg	2024-12-19 12:36:35.133592+00	2024-12-19 12:36:50.179817+00	2024-12-19 12:36:35.108727+00	2024-12-19 12:36:50.181851+00
41	4	fd	vdvd	ended	ACcbewjSodXijV5xR1pDG9mprwf5iORZfVKY1qw92UVERPi4	42e10a80-7d7e-4fa5-b7e1-fcd415ffcb53	camera	4_1734612014873904545.jpeg	2024-12-19 12:40:14.925201+00	2024-12-19 12:40:22.235727+00	2024-12-19 12:40:14.875973+00	2024-12-19 12:40:22.237172+00
42	4	fdv	fvdfd	ended	tMbT16xH01S1XRrqDYp9yXu9clFbOdu2kUEQLcO5Cx5Iy2UP	f3ea769b-a0b7-4085-ae3e-b8cf1587a489	camera	4_1734612100307905617.jpeg	2024-12-19 12:41:40.366666+00	2024-12-19 12:43:37.901183+00	2024-12-19 12:41:40.32291+00	2024-12-19 12:43:37.902938+00
43	4	Th 10 attack	Th10 max attack	ended	7r0IH2Lo8T7MwoI3eUbljCdHHJ8gSHdhA2uHw7tP6DOf0XvG	98178dee-e874-4b7c-ae2f-5957808b1afa	camera	4_1734678237187179840.jpeg	2024-12-20 07:04:30.327791+00	2024-12-20 07:06:19.241081+00	2024-12-20 07:03:57.223324+00	2024-12-20 07:06:19.253371+00
44	4	Th 10 attack	Th10 max attack	ended	T2quYX3LWvkjBuW8pGGky3s7KJMcXWSfgJ5jm4MavpDuRukd	13a1b470-319d-42db-a308-23049f0363be	camera	4_1734678399407114075.jpeg	2024-12-20 07:06:46.529025+00	2024-12-20 07:07:13.430271+00	2024-12-20 07:06:39.413014+00	2024-12-20 07:07:13.431374+00
45	4	Th 10 attack	Th10 max attack	ended	3S4zxfr4KpaXF6bMTntTXpSFsv5jwvXDwu2TZuwIdxEx8eK1	3c0b7054-7876-43e5-94e8-130aef492cfe	camera	4_1734679095186321496.jpeg	2024-12-20 07:18:19.489363+00	2024-12-20 07:18:31.909966+00	2024-12-20 07:18:15.188317+00	2024-12-20 07:18:31.911138+00
46	4	Th 10 attack	Th10 max attack	ended	ze69MktUHWMEwuAXtDPH5mgKDHgcPibVQDKrhJCvQq8HP8Z5	cdb03d41-6c14-4be6-85f9-0a1093af5e91	camera	4_1734701814279522771.jpeg	2024-12-20 13:37:01.330612+00	2024-12-20 13:41:01.139806+00	2024-12-20 13:36:54.306566+00	2024-12-20 13:41:01.154074+00
47	4	23441324qrqw	eqwt222	upcoming	\N	dd799694-39be-48bf-972e-3e2c54076613	pre_record	4_1735309672205612600.jpg	\N	\N	2024-12-27 14:27:52.209888+00	2024-12-27 14:27:52.209888+00
48	4	test 12354	eqe2r2	upcoming	\N	7fbcffab-eb7f-4677-a037-853a6b27ab91	pre_record	4_1735309915425274500.jpg	\N	\N	2024-12-27 14:31:55.430469+00	2024-12-27 14:31:55.430469+00
49	4	test tiep nhe	test tiep nhe	upcoming	\N	d43ecb26-320b-48cd-afc5-43a134f53f6a	pre_record	4_1735309993632115700.jpg	\N	\N	2024-12-27 14:33:13.639132+00	2024-12-27 14:33:13.639132+00
50	4	test123	test12312313	upcoming	\N	a33a6003-b042-4ef9-a299-6e1b304d7254	pre_record	4_1735383350731562900.jpg	\N	\N	2024-12-28 10:55:50.735596+00	2024-12-28 10:55:50.735596+00
51	4	this is a recording for create new session func	this is a recording for create new session func	upcoming	\N	ed795bed-da8d-4e89-a9f5-ba8896b41f81	pre_record	4_1735383443394672400.jpg	\N	\N	2024-12-28 10:57:23.398319+00	2024-12-28 10:57:23.398319+00
52	4	123213	wqewqeq	upcoming	\N	b81349d2-21df-4107-a875-8333f0beba1d	pre_record	4_1735891736912868900.jpg	\N	\N	2025-01-03 08:08:56.917482+00	2025-01-03 08:08:56.917482+00
53	4	123213	123213	upcoming	\N	0384b6ac-d413-401e-89e1-e80f5000e432	pre_record	4_1736141557714595300.jpg	\N	\N	2025-01-06 05:32:37.717894+00	2025-01-06 05:32:37.717894+00
54	4	My Testing demo	My Testing demo	upcoming	\N	e886dbb5-f037-43b3-89cd-af08c5b138da	pre_record	4_1736152859914829200.jpg	\N	\N	2025-01-06 08:40:59.91909+00	2025-01-06 08:40:59.91909+00
55	4	qerqerqe	erqer	upcoming	\N	90cd429c-0342-459f-92ee-808e3566562f	pre_record	4_1736154873543803600.jpg	\N	\N	2025-01-06 09:14:33.549378+00	2025-01-06 09:14:33.549378+00
56	4	toi dip zai	toi dip zai	upcoming	\N	3fd8842c-34b8-4d10-aedb-77a8f030a4aa	pre_record	4_1736155528542500100.jpg	\N	\N	2025-01-06 09:25:28.546228+00	2025-01-06 09:25:28.546228+00
57	4	2r3r23r2	2r3r23r2	upcoming	\N	915c2156-879a-41cc-87fd-cfe222c7e8cd	pre_record	4_1736159103486161600.jpg	\N	\N	2025-01-06 10:25:03.489335+00	2025-01-06 10:25:03.489335+00
58	4	093412394081	093412394081	upcoming	\N	2ba4dec2-5c6f-4f22-8312-2bc6dd3fdbda	pre_record	4_1736159231156912600.jpg	\N	\N	2025-01-06 10:27:11.160699+00	2025-01-06 10:27:11.160699+00
59	4	abcoiwerjoiqjroqi	abcoiwerjoiqjroqi	upcoming	\N	6d926fdb-a612-4ddf-b212-8f7dd674ef0d	pre_record	4_1736159702961814700.jpg	\N	\N	2025-01-06 10:35:02.966584+00	2025-01-06 10:35:02.966584+00
60	4	test21312312	test21312312	upcoming	\N	18280966-ee67-4d82-be85-90ee44a747a6	pre_record	4_1736162674272820000.jpg	\N	\N	2025-01-06 11:24:34.276115+00	2025-01-06 11:24:34.276115+00
61	4	121e1	1e21w	upcoming	\N	9b2626d9-eb8d-4ad7-b5eb-93c148813b6b	pre_record	4_1736165866563000700.jpg	\N	\N	2025-01-06 12:17:46.567572+00	2025-01-06 12:17:46.567572+00
62	4	eqwopjkadopsj	eqwopjkadopsj	upcoming	\N	5eb831e6-b44a-41c2-938e-d9b2f5812731	pre_record	4_1736166850991263700.jpg	\N	\N	2025-01-06 12:34:10.995246+00	2025-01-06 12:34:10.995246+00
63	4	12312312312	eqwopjkadopsjeqwopjkadopsj	upcoming	\N	3fc15089-c621-48f1-a5b0-0eba6aa881b9	pre_record	4_1736166912853764200.jpg	\N	\N	2025-01-06 12:35:12.856788+00	2025-01-06 12:35:12.856788+00
64	4	12321testteste	12321testteste	upcoming	\N	b05614f1-5597-41c2-9f5b-4f49fb367c9d	pre_record	4_1736228410482751900.jpg	\N	\N	2025-01-07 05:40:10.487966+00	2025-01-07 05:40:10.487966+00
65	4	packeyu	packeyu	upcoming	\N	84170a43-3873-4c46-9479-9754482dd8f5	pre_record	4_1736229428336860500.jpg	\N	\N	2025-01-07 05:57:08.342984+00	2025-01-07 05:57:08.342984+00
66	4	toi yeu em	toi yeu em	upcoming	\N	f5ede6f0-c0ca-4fcb-bfc6-4fa3730aa21b	pre_record	4_1736246287224781500.jpg	\N	\N	2025-01-07 10:38:07.229029+00	2025-01-07 10:38:07.229029+00
67	4	21312eee	21312eee	upcoming	\N	e44fd677-e9d3-478f-91fe-662bec72361e	pre_record	4_1736250601294862000.jpg	\N	\N	2025-01-07 11:50:01.30027+00	2025-01-07 11:50:01.30027+00
68	4	324assdas	324assdas	upcoming	\N	a94a0961-c3b8-43e3-9b90-2acb538d5f75	pre_record	4_1736251647734389000.jpg	\N	\N	2025-01-07 12:07:27.739709+00	2025-01-07 12:07:27.739709+00
69	4	téttestetet	téttestetet	upcoming	\N	e60a0137-fec9-4914-9786-42108879201c	pre_record	4_1736251681461172600.png	\N	\N	2025-01-07 12:08:01.465502+00	2025-01-07 12:08:01.465502+00
70	4	conzoi	conzoi	upcoming	\N	99d6fc1b-cf31-49f9-ad02-6d54346653fd	pre_record	4_1736251912546540200.jpg	\N	\N	2025-01-07 12:11:52.550592+00	2025-01-07 12:11:52.550592+00
71	4	test1312	sadsad	upcoming	\N	77fbfc86-b4d4-4875-a737-a0cddb8a1eb8	pre_record	4_1736258997723732800.png	\N	\N	2025-01-07 14:09:57.753702+00	2025-01-07 14:09:57.753702+00
2	4	Th 10 attack	Th10 max attack	pending	M8uW2Pd70YU62jB055jkH21Zpq2vmu0pY82ONQFzkioA9Mfq	2bbc9b24-2cbb-420b-90da-6bef38d4dab8	camera	1_1736399100250620300.png	\N	\N	2024-12-18 12:07:07.694675+00	2025-01-09 05:05:00.253793+00
20	4	Th 10 attack	Th10 max attack	started	yUcUMOUf4RYcOVrR3rR1VNU0FA1jOFuYuAOTnq61isDfJwfH	85411d00-b70d-4109-bb74-bd83b87951d1	camera	4_1734527564432043902.jpeg	2024-12-18 13:12:52.129922+00	\N	2025-01-10 11:57:32.31+00	2024-12-18 13:12:52.13129+00
\.


--
-- TOC entry 3201 (class 0 OID 16490)
-- Dependencies: 219
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, subscriber_id, streamer_id, created_at, is_mute) FROM stdin;
\.


--
-- TOC entry 3203 (class 0 OID 16497)
-- Dependencies: 221
-- Data for Name: two_fas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.two_fas (id, user_id, secret, is2fa_enabled, created_at, updated_at) FROM stdin;
7	5	VE6EEEERAN2AAOVC3S3OKM4GK5JZNOOJ	f	2024-12-19 14:03:54.139324+00	2024-12-19 14:07:01.330982+00
\.


--
-- TOC entry 3205 (class 0 OID 16509)
-- Dependencies: 223
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, display_name, email, password_hash, otp, otp_expires_at, role_id, created_at, created_by_id, updated_at, updated_by_id, deleted_at, deleted_by_id, avatar_file_name, status, blocked_reason, num_notification) FROM stdin;
3	strange	Strange	strange@gmail.com	$2a$14$VjLtrxU.JIXbj2EKOUqhNuYzOQyx41./ODPsDXO3Dx9188xGNZePC		\N	1	2024-12-10 06:34:50.527186+00	2	2024-12-10 06:34:50.527186+00	2	\N	\N	\N	offline	\N	0
16	bbbb	bbbb	bbbb@gmail.com	$2a$14$Y7S0H/zw4/PlbY6dznEvD.Z8/p4JNSDx.LV5J3DC6JkICx6s7O3zW	\N	\N	3	2025-01-15 10:54:55.363987+00	1	2025-01-15 10:54:55.363987+00	1	\N	\N	\N	offline	\N	0
2	binhanoi	binhanoi 123	binh@gmail.com	$2a$14$Y7S0H/zw4/PlbY6dznEvD.Z8/p4JNSDx.LV5J3DC6JkICx6s7O3zW		\N	2	2024-12-10 06:30:33.202541+00	1	2024-12-10 06:30:33.202541+00	1	\N	\N	\N	offline	\N	0
6	momo	Mo Mo	momo@gmail.com	$2a$14$Y7S0H/zw4/PlbY6dznEvD.Z8/p4JNSDx.LV5J3DC6JkICx6s7O3zW		\N	2	2024-12-20 13:28:07.291086+00	1	2024-12-20 13:28:07.291086+00	1	\N	\N	\N	offline	\N	0
4	user25	User 26	usertest11@gmail.com	$2a$14$Y7S0H/zw4/PlbY6dznEvD.Z8/p4JNSDx.LV5J3DC6JkICx6s7O3zW	\N	\N	3	2024-12-10 08:36:36.803124+00	1	2025-01-10 06:21:46.50716+00	1	\N	\N	\N	offline	\N	0
5	user1	User 1	user1@gmail.com	$2a$14$VjLtrxU.JIXbj2EKOUqhNuYzOQyx41./ODPsDXO3Dx9188xGNZePC		\N	3	2024-12-15 06:55:32.413937+00	\N	2025-01-15 10:46:05.374479+00	1	\N	\N	1734422648403313530.jpeg	offline	aaa	0
7	testuser123445sadsadasd	Test User 12345asdassad	testusersupesadrAdmin1234@gmail.com	$2a$14$mnde9JeomeZir5YVGGgVDewNIAWXEWisCBzntr3HqV7k3wcfSwDji		\N	4	2025-01-15 10:53:07.50892+00	1	2025-01-15 10:53:07.50892+00	1	\N	\N	\N	offline		0
15	sad	aaaaa	asdsd@gmail.com	$2a$14$Y7S0H/zw4/PlbY6dznEvD.Z8/p4JNSDx.LV5J3DC6JkICx6s7O3zW	\N	\N	3	2025-01-15 10:54:07.474978+00	1	2025-01-15 10:54:07.474978+00	1	\N	\N	1734422648403313530.jpeg	offline	\N	0
18	algo12345	Algo	algo123@gmail.com	$2a$14$9V7Vkesnj2WSSBrySIzfm.CTOPVtke2ZSIqoo2HCkHuoQXIdQBCXu		\N	3	2025-01-19 10:31:01.626624+00	1	2025-01-19 10:31:01.626624+00	1	\N	\N	1737282660801559000.png	offline		0
1	superAdmin		superAdmin@gmail.com	$2a$14$Y7S0H/zw4/PlbY6dznEvD.Z8/p4JNSDx.LV5J3DC6JkICx6s7O3zW		\N	1	2024-12-10 06:29:35.803991+00	\N	2025-01-19 10:41:14.934668+00	1	\N	\N	\N	online	\N	0
\.


--
-- TOC entry 3207 (class 0 OID 16520)
-- Dependencies: 225
-- Data for Name: views; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.views (id, user_id, stream_id, view_type, is_viewing, created_at, updated_at) FROM stdin;
1	4	20	live_view	t	2024-12-18 13:13:01.757324+00	2024-12-18 13:13:01.757324+00
2	5	20	live_view	t	2024-12-18 13:13:29.451479+00	2024-12-18 13:13:29.451479+00
3	4	21	live_view	t	2024-12-18 13:19:49.286377+00	2024-12-18 13:19:49.286377+00
4	5	21	live_view	t	2024-12-18 13:19:56.034033+00	2024-12-18 13:19:56.034033+00
5	4	22	live_view	t	2024-12-18 13:55:55.967559+00	2024-12-18 13:55:55.967559+00
6	5	22	live_view	t	2024-12-18 13:56:01.505506+00	2024-12-18 13:56:01.505506+00
7	4	23	live_view	t	2024-12-18 14:01:47.461239+00	2024-12-18 14:01:47.461239+00
8	5	23	live_view	t	2024-12-18 14:02:09.913694+00	2024-12-18 14:02:09.913694+00
11	5	32	live_view	f	2024-12-19 08:17:57.708459+00	2024-12-19 08:18:06.497038+00
10	4	32	live_view	f	2024-12-19 08:17:48.481036+00	2024-12-19 08:18:33.789745+00
12	4	35	live_view	f	2024-12-19 11:51:53.977672+00	2024-12-19 11:52:42.732619+00
13	4	36	live_view	f	2024-12-19 11:53:02.555303+00	2024-12-19 11:53:26.978498+00
15	5	37	live_view	f	2024-12-19 11:56:46.173887+00	2024-12-19 11:59:05.207973+00
14	4	37	live_view	f	2024-12-19 11:56:18.804873+00	2024-12-19 11:59:05.22639+00
16	4	38	live_view	f	2024-12-19 12:11:43.8998+00	2024-12-19 12:11:54.999939+00
17	4	39	live_view	f	2024-12-19 12:13:10.901685+00	2024-12-19 12:21:04.647102+00
18	4	40	live_view	f	2024-12-19 12:36:35.195211+00	2024-12-19 12:36:50.181871+00
19	4	41	live_view	f	2024-12-19 12:40:15.006743+00	2024-12-19 12:40:22.236929+00
20	4	42	live_view	f	2024-12-19 12:41:40.475477+00	2024-12-19 12:43:37.902803+00
22	5	43	live_view	f	2024-12-20 07:05:11.54013+00	2024-12-20 07:06:19.242924+00
21	4	43	live_view	f	2024-12-20 07:04:34.104142+00	2024-12-20 07:06:19.243246+00
23	4	44	live_view	f	2024-12-20 07:06:54.522663+00	2024-12-20 07:07:13.433866+00
24	5	44	live_view	f	2024-12-20 07:06:59.753462+00	2024-12-20 07:07:13.442367+00
25	4	45	live_view	f	2024-12-20 07:18:23.620909+00	2024-12-20 07:18:31.91368+00
26	5	45	live_view	f	2024-12-20 07:18:28.19195+00	2024-12-20 07:18:31.928716+00
27	4	46	live_view	f	2024-12-20 13:37:07.227448+00	2024-12-20 13:41:01.140732+00
28	5	46	live_view	f	2024-12-20 13:37:42.376839+00	2024-12-20 13:41:01.140738+00
9	4	24	live_view	t	2025-01-10 11:57:32.31+00	2024-12-18 14:11:22.849367+00
\.


--
-- TOC entry 3219 (class 0 OID 0)
-- Dependencies: 196
-- Name: admin_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_logs_id_seq', 3152, true);


--
-- TOC entry 3220 (class 0 OID 0)
-- Dependencies: 226
-- Name: bookmarks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookmarks_id_seq', 2, true);


--
-- TOC entry 3221 (class 0 OID 0)
-- Dependencies: 199
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 6, true);


--
-- TOC entry 3222 (class 0 OID 0)
-- Dependencies: 201
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- TOC entry 3223 (class 0 OID 0)
-- Dependencies: 203
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.likes_id_seq', 1, false);


--
-- TOC entry 3224 (class 0 OID 0)
-- Dependencies: 205
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- TOC entry 3225 (class 0 OID 0)
-- Dependencies: 207
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- TOC entry 3226 (class 0 OID 0)
-- Dependencies: 210
-- Name: schedule_streams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_streams_id_seq', 25, true);


--
-- TOC entry 3227 (class 0 OID 0)
-- Dependencies: 211
-- Name: shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shares_id_seq', 2, true);


--
-- TOC entry 3228 (class 0 OID 0)
-- Dependencies: 213
-- Name: stream_analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stream_analytics_id_seq', 1, false);


--
-- TOC entry 3229 (class 0 OID 0)
-- Dependencies: 216
-- Name: streams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.streams_id_seq', 71, true);


--
-- TOC entry 3230 (class 0 OID 0)
-- Dependencies: 218
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- TOC entry 3231 (class 0 OID 0)
-- Dependencies: 220
-- Name: two_fas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.two_fas_id_seq', 1, false);


--
-- TOC entry 3232 (class 0 OID 0)
-- Dependencies: 222
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 18, true);


--
-- TOC entry 3233 (class 0 OID 0)
-- Dependencies: 224
-- Name: views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.views_id_seq', 1, false);


--
-- TOC entry 2974 (class 2606 OID 16529)
-- Name: admin_logs admin_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_logs
    ADD CONSTRAINT admin_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 2976 (class 2606 OID 16531)
-- Name: blocked_lists blocked_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocked_lists
    ADD CONSTRAINT blocked_lists_pkey PRIMARY KEY (user_id, blocked_user_id);


--
-- TOC entry 3026 (class 2606 OID 24586)
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- TOC entry 2978 (class 2606 OID 16533)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2982 (class 2606 OID 16535)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 2984 (class 2606 OID 16537)
-- Name: likes idx_user_stream; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT idx_user_stream UNIQUE (user_id, stream_id);


--
-- TOC entry 3022 (class 2606 OID 16539)
-- Name: views idx_view_user_stream; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.views
    ADD CONSTRAINT idx_view_user_stream UNIQUE (user_id, stream_id);


--
-- TOC entry 2986 (class 2606 OID 16541)
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- TOC entry 2988 (class 2606 OID 16543)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 2990 (class 2606 OID 16545)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 2994 (class 2606 OID 16547)
-- Name: schedule_streams schedule_streams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_streams
    ADD CONSTRAINT schedule_streams_pkey PRIMARY KEY (id);


--
-- TOC entry 2997 (class 2606 OID 16549)
-- Name: shares shares_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT shares_pkey PRIMARY KEY (id);


--
-- TOC entry 2999 (class 2606 OID 16551)
-- Name: stream_analytics stream_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_analytics
    ADD CONSTRAINT stream_analytics_pkey PRIMARY KEY (id);


--
-- TOC entry 3003 (class 2606 OID 16553)
-- Name: stream_categories stream_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_categories
    ADD CONSTRAINT stream_categories_pkey PRIMARY KEY (category_id, stream_id);


--
-- TOC entry 3005 (class 2606 OID 16555)
-- Name: streams streams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streams
    ADD CONSTRAINT streams_pkey PRIMARY KEY (id);


--
-- TOC entry 3008 (class 2606 OID 16557)
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 3010 (class 2606 OID 16559)
-- Name: two_fas two_fas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.two_fas
    ADD CONSTRAINT two_fas_pkey PRIMARY KEY (id);


--
-- TOC entry 2980 (class 2606 OID 16561)
-- Name: categories uni_categories_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT uni_categories_name UNIQUE (name);


--
-- TOC entry 2992 (class 2606 OID 16563)
-- Name: roles uni_roles_type; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT uni_roles_type UNIQUE (type);


--
-- TOC entry 3001 (class 2606 OID 16565)
-- Name: stream_analytics uni_stream_analytics_stream_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_analytics
    ADD CONSTRAINT uni_stream_analytics_stream_id UNIQUE (stream_id);


--
-- TOC entry 3012 (class 2606 OID 16567)
-- Name: two_fas uni_two_fas_user_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.two_fas
    ADD CONSTRAINT uni_two_fas_user_id UNIQUE (user_id);


--
-- TOC entry 3016 (class 2606 OID 16569)
-- Name: users uni_users_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uni_users_email UNIQUE (email);


--
-- TOC entry 3018 (class 2606 OID 16571)
-- Name: users uni_users_username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uni_users_username UNIQUE (username);


--
-- TOC entry 3020 (class 2606 OID 16573)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3024 (class 2606 OID 16575)
-- Name: views views_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.views
    ADD CONSTRAINT views_pkey PRIMARY KEY (id);


--
-- TOC entry 3027 (class 1259 OID 24597)
-- Name: idx_bookmark_user_stream; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_bookmark_user_stream ON public.bookmarks USING btree (user_id, stream_id);


--
-- TOC entry 2995 (class 1259 OID 57346)
-- Name: idx_share_user_stream; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_share_user_stream ON public.shares USING btree (user_id, stream_id);


--
-- TOC entry 3006 (class 1259 OID 16576)
-- Name: idx_streamer_subscriber; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_streamer_subscriber ON public.subscriptions USING btree (subscriber_id, streamer_id);


--
-- TOC entry 3013 (class 1259 OID 16577)
-- Name: idx_users_created_by_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_created_by_id ON public.users USING btree (created_by_id);


--
-- TOC entry 3014 (class 1259 OID 16578)
-- Name: idx_users_updated_by_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_updated_by_id ON public.users USING btree (updated_by_id);


--
-- TOC entry 3029 (class 2606 OID 16579)
-- Name: blocked_lists fk_blocked_lists_blocked_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocked_lists
    ADD CONSTRAINT fk_blocked_lists_blocked_user FOREIGN KEY (blocked_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3030 (class 2606 OID 16584)
-- Name: blocked_lists fk_blocked_lists_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocked_lists
    ADD CONSTRAINT fk_blocked_lists_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3055 (class 2606 OID 24592)
-- Name: bookmarks fk_bookmarks_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT fk_bookmarks_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- TOC entry 3056 (class 2606 OID 24587)
-- Name: bookmarks fk_bookmarks_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3033 (class 2606 OID 16589)
-- Name: comments fk_comments_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- TOC entry 3034 (class 2606 OID 16594)
-- Name: comments fk_comments_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3035 (class 2606 OID 16599)
-- Name: likes fk_likes_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT fk_likes_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- TOC entry 3036 (class 2606 OID 16604)
-- Name: likes fk_likes_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3037 (class 2606 OID 16609)
-- Name: notifications fk_notifications_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- TOC entry 3038 (class 2606 OID 16614)
-- Name: notifications fk_notifications_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3050 (class 2606 OID 16619)
-- Name: users fk_roles_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_roles_users FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 3039 (class 2606 OID 16624)
-- Name: schedule_streams fk_schedule_streams_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_streams
    ADD CONSTRAINT fk_schedule_streams_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- TOC entry 3040 (class 2606 OID 16629)
-- Name: shares fk_shares_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT fk_shares_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- TOC entry 3041 (class 2606 OID 16634)
-- Name: shares fk_shares_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT fk_shares_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3042 (class 2606 OID 16639)
-- Name: stream_analytics fk_stream_analytics_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_analytics
    ADD CONSTRAINT fk_stream_analytics_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- TOC entry 3044 (class 2606 OID 16644)
-- Name: stream_categories fk_stream_categories_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_categories
    ADD CONSTRAINT fk_stream_categories_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- TOC entry 3045 (class 2606 OID 16649)
-- Name: stream_categories fk_stream_categories_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_categories
    ADD CONSTRAINT fk_stream_categories_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- TOC entry 3043 (class 2606 OID 16654)
-- Name: stream_analytics fk_streams_stream_analytic; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stream_analytics
    ADD CONSTRAINT fk_streams_stream_analytic FOREIGN KEY (stream_id) REFERENCES public.streams(id);


--
-- TOC entry 3046 (class 2606 OID 16659)
-- Name: streams fk_streams_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streams
    ADD CONSTRAINT fk_streams_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3047 (class 2606 OID 16664)
-- Name: subscriptions fk_subscriptions_streamer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT fk_subscriptions_streamer FOREIGN KEY (streamer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3048 (class 2606 OID 16669)
-- Name: subscriptions fk_subscriptions_subscriber; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT fk_subscriptions_subscriber FOREIGN KEY (subscriber_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3049 (class 2606 OID 16674)
-- Name: two_fas fk_two_fas_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.two_fas
    ADD CONSTRAINT fk_two_fas_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3028 (class 2606 OID 16679)
-- Name: admin_logs fk_users_admin_logs; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_logs
    ADD CONSTRAINT fk_users_admin_logs FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3051 (class 2606 OID 16684)
-- Name: users fk_users_created_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- TOC entry 3031 (class 2606 OID 16689)
-- Name: categories fk_users_created_by_categories; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT fk_users_created_by_categories FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- TOC entry 3052 (class 2606 OID 16694)
-- Name: users fk_users_updated_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- TOC entry 3032 (class 2606 OID 16699)
-- Name: categories fk_users_updated_by_categories; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT fk_users_updated_by_categories FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- TOC entry 3053 (class 2606 OID 16704)
-- Name: views fk_views_stream; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.views
    ADD CONSTRAINT fk_views_stream FOREIGN KEY (stream_id) REFERENCES public.streams(id) ON DELETE CASCADE;


--
-- TOC entry 3054 (class 2606 OID 16709)
-- Name: views fk_views_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.views
    ADD CONSTRAINT fk_views_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3216 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2025-01-19 17:45:34

--
-- PostgreSQL database dump complete
--

