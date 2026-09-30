-- Generado automaticamente por scripts/mysql-to-postgres.mjs
-- desde un dump de phpMyAdmin (MySQL). No editar a mano.

INSERT INTO "admins" ("id", "username", "password_hash") VALUES
  (1, 'admin', '$2b$10$Zi.8eixo7FAeibA5YjL4oumqeHea8qs8RotymDSXasrjH3n.trLkG') ON CONFLICT DO NOTHING;

INSERT INTO "categories" ("id", "name") VALUES
  (1, 'Anillos'),
  (3, 'Aros'),
  (2, 'Cadenitas'),
  (5, 'Dijes'),
  (4, 'Pulseras') ON CONFLICT DO NOTHING;

INSERT INTO "products" ("id", "name", "price", "stock", "icon", "image_url", "category_id", "created_at") VALUES
  (1, 'Anillo de Acero blanco brillos seguidos size 18', '8000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788359788/mlo02alglsfky2vaij0z.jpg', 1, '2026-09-02 14:36:33'),
  (3, 'Anillo Acero Dorado Brillos y piedra principal Midi', '9000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788359904/tzrfgbxqlg2rgwmekaa7.jpg', 1, '2026-09-02 14:39:32'),
  (4, 'Anillo Metal Fantasia Flecha con perla blanca', '1000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788359993/gfmmdqyamxunjpntot45.jpg', 1, '2026-09-02 14:40:31'),
  (5, 'Anillo Metal Fantasia brillitos Regulable', '1000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788360063/bimdsldtf3tyi2vpb5b7.jpg', 1, '2026-09-02 14:41:25'),
  (7, 'Anillo Acero Blanco Brillos Pinche', '8000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788360273/waczhspqnzzkqwz3atzp.jpg', 1, '2026-09-02 14:45:01'),
  (9, 'Anillo Metal Fantasia Brillo simple', '1000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788360499/zi4949wwyrimliajn2hy.jpg', 1, '2026-09-02 14:48:41'),
  (11, 'Anillo Metal Fantasia Brillos Flor', '1000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788360569/nv38m5weh2vthe3aj2yk.jpg', 1, '2026-09-02 14:49:46'),
  (12, 'Anillo Metal Fantasia Brillos Luna Regulable', '1000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788360595/mdlie9n2xias2dsqqgb0.jpg', 1, '2026-09-02 14:50:32'),
  (13, 'Aros Aguja rosa Acero blanco', '7000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788360681/j2kwbxgonzjxlibtxost.jpg', 3, '2026-09-02 14:52:06'),
  (14, 'Aros Aguja Blancos Acero Blanco', '7000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788360764/x9pwfb8xzniv2kowhvev.jpg', 3, '2026-09-02 14:53:09'),
  (15, 'Cuff plata 925 Brillos', '12000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788360822/wkbp2yolbpwernkxftqo.jpg', 3, '2026-09-02 14:54:09'),
  (16, 'Dije de plata 295 Con brillo Virgen', '12000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788360857/h7il8tpeg54tsawpxlbn.jpg', 5, '2026-09-02 14:54:47'),
  (17, 'Aros argolla canasta Plata 925', '10000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788360926/coywtxdqsudn7za4wy29.jpg', 3, '2026-09-02 14:55:56'),
  (18, 'Aros Plata 925 Borlita arenada', '10000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788360969/pe3w30f1d1uqrxmlkj1i.jpg', 3, '2026-09-02 14:56:58'),
  (21, 'Aros Moño rosa y brillos Acero Blanco', '10000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788361397/se2uqitxa5mckefkhljd.jpg', 3, '2026-09-02 15:03:49'),
  (22, 'Aros Acero Blanco Brillos', '10000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788361437/xvdikyqeyksmmawtcyd1.jpg', 3, '2026-09-02 15:04:21'),
  (23, 'Aros Acero Blanco Colores Pasteles', '10000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788361471/cyntobsgeftfost0gpeq.jpg', 3, '2026-09-02 15:04:49'),
  (24, 'Aro Estrella Acero Blanco Solitario', '1500.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788361528/xtqslingonqqsuia8ztv.jpg', 3, '2026-09-02 15:05:50'),
  (25, 'Aros Flor Acero quirúrgico', '2500.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788361815/fisutkv9do0lkzy5kznk.jpg', 3, '2026-09-02 15:10:55'),
  (26, 'Aros Cuadrados Acero quirúrgico', '4000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788361864/mrsxkrwzfdqnigaaxayy.jpg', 3, '2026-09-02 15:11:24'),
  (27, 'Pasantes Estrella Acero Blanco', '2000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788361893/somy1aqgpiaihcegvqur.jpg', 3, '2026-09-02 15:11:55'),
  (28, 'Aros Full Stras', '1.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788361936/rjapp6xrcpwodm47abwr.jpg', 3, '2026-09-02 15:12:41'),
  (29, 'Aros Cuadrados Acero Blanco', '1.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788361975/qbdgtcz8jdq02qs2j3fq.jpg', 3, '2026-09-02 15:13:22'),
  (30, 'Aros Argolla con dije corazon bordo colgante Acero Blanco', '1.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788362010/ygkzp33viit2hsbx6crr.jpg', 3, '2026-09-02 15:13:56'),
  (31, 'Aros pasantes pelotita Acero Dorado', '2500.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788362045/ynidjbp9e5rbdbt6irmy.jpg', 3, '2026-09-02 15:14:37'),
  (32, 'Aros Pasantes Captus Acero dorado', '2500.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788362090/zr2upk4mxqaljyjngy3u.jpg', 3, '2026-09-02 15:15:17'),
  (33, 'Aros argolla con cubic y diamante colgando', '12000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788435405/zlwjimsqpzxd5r5okang.jpg', 3, '2026-09-03 11:37:48'),
  (34, 'Aros argollita con cubic cuadrado diamante', '14000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788435475/x9jj3pr3y3usggsu1on7.jpg', 3, '2026-09-03 11:38:33'),
  (35, 'Argollita Acero dorado con cubic', '10000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788435520/bxpf72tw4ior1ggharhm.jpg', 3, '2026-09-03 11:39:17'),
  (40, 'Aros Argolla con Cubic Plata 925', '20000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788435736/gekxhxcjwvcjxxxvq6kk.jpg', 3, '2026-09-03 11:43:07'),
  (41, 'Cadena Singapur Plata 925', '25000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788435796/eiccxmhabhsevuzjp0cq.jpg', 2, '2026-09-03 11:43:47'),
  (42, 'Cadenita con dije de plata 925 pluma', '50000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788435963/vyqmjiev9nizxxizzilb.jpg', 2, '2026-09-03 11:46:50'),
  (44, 'Argollas Corazon Plata 925 con cubic', '20000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788436548/coamgynfgcqiznalax9q.jpg', 3, '2026-09-03 11:56:40'),
  (45, 'Mini Argollas con cubic plata 925', '18000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788436612/uhgyxhmwremjlgx4xd5l.jpg', 3, '2026-09-03 11:57:37'),
  (46, 'Pulsera eslabones Acero Blanco', '8000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788436667/twuh7kwlmwatsjvsdmjh.jpg', 4, '2026-09-03 11:58:33'),
  (47, 'Aros argolla con cubic  plata 925', '20000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788436732/pwnrh8uxhurvme6vnsdz.jpg', 3, '2026-09-03 11:59:44'),
  (48, 'Pulsera de hilo corazon pasante', '2500.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788436812/bi8ou8benhcfccar0opi.jpg', 4, '2026-09-03 12:00:34'),
  (49, 'Pulsera ojo Turco de hilo (varios colores)', '3000.00', 20, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788436841/valm5nngciujfubg5ny5.jpg', 4, '2026-09-03 12:01:14'),
  (50, 'Aros pasantes de plata 925 hojitas trepador', '15000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788436894/i5rkkhvbmhutuslquofd.jpg', 3, '2026-09-03 12:02:09'),
  (51, 'Cadenitaeslabones redondos de acero blanco', '0.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788436941/ojngklqdajtphy9kwuhc.jpg', 2, '2026-09-03 12:02:45'),
  (52, 'Pulsera cristal negro', '3500.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788436977/tdlfhjltopuduwjjrtfq.jpg', 4, '2026-09-03 12:03:26'),
  (53, 'Pulsera de acero blanco', '0.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788437015/g6thbqgawstjksd15y4q.jpg', 4, '2026-09-03 12:04:01'),
  (55, 'Pulsera estrella y perlas', '2000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788437072/h61qrcs4hedvj98b7z9f.jpg', 4, '2026-09-03 12:04:49'),
  (56, 'Pulseras eslabones Acero Blanco', '0.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788437095/twzdtegieazh79hi5g4q.jpg', 4, '2026-09-03 12:05:13'),
  (57, 'Anillo cubic Acero Blanco size 18', '0.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788437140/ydpzt3wjfvsgpjwnjigh.jpg', 1, '2026-09-03 12:06:24'),
  (58, 'Anillo de acero blanco cubic y cristales', '0.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788437237/npmap9ljg8g5mwe0oilv.jpg', 1, '2026-09-03 12:07:35'),
  (60, 'Aros canasta mini', '10000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788437619/wgmp3xxjbh5mbkc7aa9g.jpg', 3, '2026-09-03 12:14:35'),
  (61, 'Aros canasta con cubic acero dorado', '15000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788437684/spy3mqi8ykqxxxufpqjb.jpg', 3, '2026-09-03 12:15:26'),
  (64, 'Cadena chata de acero blanco', '0.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788437789/swal5veuiqzjot1jmkqd.jpg', 2, '2026-09-03 12:16:46'),
  (65, 'Aros argolla de plata 925 con corazon de nacar', '0.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788437817/ocj3j5l3qqbgyzozoxna.jpg', 3, '2026-09-03 12:17:34'),
  (66, 'Aros tringulos cubic plata 925', '0.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788437860/ogcyb0d9l8pgubuaabhh.jpg', 3, '2026-09-03 12:18:17'),
  (67, 'Argollas mini plata 925 con 3 cubic', '0.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788437905/ztzgizwbkc553sxberml.jpg', 3, '2026-09-03 12:18:50'),
  (69, 'collar de tanza corazon plata 925', '0.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438013/xjiaiuf6jgyvfyiruenn.jpg', 2, '2026-09-03 12:20:32'),
  (70, 'Dije de plata 925 tornasol', '6000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438037/eckwuhakosgobsdlhdct.jpg', 5, '2026-09-03 12:20:55'),
  (71, 'Abridores corazon plata 925', '6000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438429/w02yranzcxbbnafnl52i.jpg', 3, '2026-09-03 12:27:18'),
  (72, 'Abridores plata 925', '6000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438455/hinog6jzf7xyjfgxqt9a.jpg', 3, '2026-09-03 12:27:48'),
  (73, 'Abridores rayo plata 925', '6000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438476/tkxwphrllndhxk2z3zxr.jpg', 3, '2026-09-03 12:28:12'),
  (74, 'Abridores brillo plata 925', '6000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438501/nsof7h11056pgxlzqfbr.jpg', 3, '2026-09-03 12:28:39'),
  (75, 'Pasantes brillo plata 925', '6000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438548/zajte8jyst4btdyqcucb.jpg', 3, '2026-09-03 12:29:39'),
  (76, 'Abridores bola arenada plata 925', '6000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438584/c46mqbgy6d5m1hg3nxv3.jpg', 3, '2026-09-03 12:30:04'),
  (77, 'Abridores estrella de mar plata 925', '6000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438621/ksaato0grl0ofh1a1wky.jpg', 3, '2026-09-03 12:30:44'),
  (78, 'Abridores 3 estrellas plata 925', '6000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438654/wb4lrv9tp9nrklum8923.jpg', 3, '2026-09-03 12:31:13'),
  (79, 'Pasantes gota brillantes plata 925', '6000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438678/w7axk2uz2zz3xrviagkw.jpg', 3, '2026-09-03 12:31:49'),
  (80, 'Abridores patitas de perro plata 925', '6000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438714/mpxsvcj4xths4snx1lss.jpg', 3, '2026-09-03 12:32:14'),
  (81, 'Abridores Flecha plata 925', '6000.00', 1, '💍', 'https://res.cloudinary.com/rawwtykh/image/upload/v1788438740/mhtxzahvexc3wl7wblba.jpg', 3, '2026-09-03 12:32:52') ON CONFLICT DO NOTHING;

INSERT INTO "store_config" ("id", "whatsapp_number") VALUES
  (1, '2644362739') ON CONFLICT (id) DO UPDATE SET whatsapp_number = EXCLUDED.whatsapp_number;

SELECT setval(pg_get_serial_sequence('categories', 'id'), 6, false);
SELECT setval(pg_get_serial_sequence('products', 'id'), 82, false);
SELECT setval(pg_get_serial_sequence('admins', 'id'), 2, false);
