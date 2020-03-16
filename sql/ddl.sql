/* Create the tables. */

DROP TABLE IF EXISTS `Recipes`;
DROP TABLE IF EXISTS `Customers`;
DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `Recipe_Ratings`;
DROP TABLE IF EXISTS `Recipes_in_Orders`;

CREATE TABLE `Recipes` ( 
`recipe_id` int(11) NOT NULL AUTO_INCREMENT, 
`recipe_name` varchar(255) NOT NULL, 
`time` int(11) NOT NULL, 
`difficulty` int(11) NOT NULL, 
`ingredients` varchar(1024) NOT NULL, 
PRIMARY KEY (`recipe_id`)
);

CREATE TABLE `Customers` ( 
`customer_id` int(11) NOT NULL AUTO_INCREMENT, 
`first_name` varchar(255) NOT NULL, 
`last_name` varchar(255) NOT NULL, 
`email` varchar(255) NOT NULL,
`password` varchar(255) NOT NULL,
`phone` varchar(14) NOT NULL, 
`admin` tinyint(1) NOT NULL DEFAULT 0, 
PRIMARY KEY (`customer_id`) 
);

CREATE TABLE `Orders` ( 
`order_id` int(11) NOT NULL AUTO_INCREMENT, 
`order_date` date NOT NULL, 
`delivery_date` date, 
`order_status` varchar(255) NOT NULL, 
`customer_id` int(11) NOT NULL, 
PRIMARY KEY (`order_id`), 
FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`customer_id`)
);

CREATE TABLE `Recipe_Ratings` ( 
`rating_id` int(11) NOT NULL AUTO_INCREMENT, 
`rating` tinyint(1), 
`date_rated` date NOT NULL, 
`customer_id` int(11), 
`recipe_id` int(11) NOT NULL, 
PRIMARY KEY (`rating_id`), 
FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`customer_id`), 
FOREIGN KEY (`recipe_id`) REFERENCES `Recipes` (`recipe_id`)
);

CREATE TABLE `Recipes_in_Orders` ( 
`order_id` int(11) NOT NULL, 
`recipe_id` int(11) NOT NULL,
`item_number` int(11),
PRIMARY KEY (`order_id`,`recipe_id`,`item_number`), 
FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`), 
FOREIGN KEY (`recipe_id`) REFERENCES `Recipes` (`recipe_id`) 
);


/* Insert sample data. */

INSERT INTO `Customers` (`first_name`, `last_name`, `email`, `password`, `phone`, `admin`) VALUES 
('Jessica', 'Albert', 'alberjes@oregonstate.edu', 'Welcome123', '414-555-6252', '1');

INSERT INTO `Customers` (`first_name`, `last_name`, `email`, `password`, `phone`, `admin`) VALUES 
('Nelson', 'Chan', 'channe@oregonstate.edu', 'Welcome123', '222-555-6666', '1');

INSERT INTO `Customers` (`first_name`, `last_name`, `email`, `password`, `phone`, `admin`) VALUES 
('John', 'Smith', 'jsmith@gmail.com', 'myPassword', '555-555-5555', '0');

INSERT INTO `Customers` (`first_name`, `last_name`, `email`, `password`, `phone`, `admin`) VALUES 
('Jane', 'Doe', 'jdoe@gmail.com', 'janePassword', '919-333-7564', '0');

INSERT INTO `Recipes` (`recipe_name`, `time`, `difficulty`, `ingredients`) VALUES
('Speedy Teriyaki Salmon', '30','2', 
'Four 6-ounce skinless salmon fillets, 2 cups teriyaki sauce, 1 tablespoon vegetable oil');

INSERT INTO `Recipes` (`recipe_name`, `time`, `difficulty`, `ingredients`) VALUES
('Chicken with Brussels Sprouts and Apple Cider Sauce', '50', '1', 
'1 pound Brussels sprouts, 2 sweet apples (such as Gala), 1 red onion');

INSERT INTO `Recipes` (`recipe_name`, `time`, `difficulty`, `ingredients`) VALUES
('Sausage Beans and Broccoli Rabe Soup', '30', '1',
'2 tablespoons extra-virgin olive oil, 1 1/4 pounds Italian bulk sweet sausage');
 
INSERT INTO `Recipes` (`recipe_name`, `time`, `difficulty`, `ingredients`) VALUES
('Chunky Chicken Chowder', '100', '2', 
'4 chicken thighs, bone in, skin removed, Kosher salt and freshly ground black pepper');

INSERT INTO `Recipes` (`recipe_name`, `time`, `difficulty`, `ingredients`) VALUES
('Creamy Orzo with Mushrooms', '70', '1', 
'8 ounces cremini mushrooms thinly sliced, 3 tablespoons extra-virgin olive oil, Kosher salt and freshly ground pepper');


INSERT INTO `Recipe_Ratings` (`rating`, `date_rated`, `customer_id`, `recipe_id`) VALUES 
('5', '2020-02-13', '4', '3');

INSERT INTO `Recipe_Ratings` (`rating`, `date_rated`, `customer_id`, `recipe_id`) VALUES 
('4', '2020-02-01', '3', '3');

INSERT INTO `Recipe_Ratings` (`rating`, `date_rated`, `customer_id`, `recipe_id`) VALUES 
('5', '2020-02-05', '2', '2');


INSERT INTO `Orders` (`order_id`, `order_date`, `order_status`, `customer_id`) VALUES 
('1001', '2020-02-20', 'PROCESSED', '4');
INSERT INTO `Recipes_in_Orders` (`order_id`, `recipe_id`, `item_number`) VALUES 
((SELECT `order_id` FROM `Orders` WHERE `order_date` = '2020-02-20' AND `customer_id` = '4'), 
(SELECT `recipe_id` FROM `Recipes` WHERE `recipe_id` = '4'), '1');
INSERT INTO `Recipes_in_Orders` (`order_id`, `recipe_id`, `item_number`) VALUES 
((SELECT `order_id` FROM `Orders` WHERE `order_date` = '2020-02-20' AND `customer_id` = '4'), 
(SELECT `recipe_id` FROM `Recipes` WHERE `recipe_id` = '3'), '2');

INSERT INTO `Orders` (`order_id`, `order_date`, `order_status`, `customer_id`) VALUES 
('1002', '2020-02-20', 'PROCESSED', '3');
INSERT INTO `Recipes_in_Orders` (`order_id`, `recipe_id`, `item_number`) VALUES 
((SELECT `order_id` FROM `Orders` WHERE `order_date` = '2020-02-20' AND `customer_id` = '3'), 
(SELECT `recipe_id` FROM `Recipes` WHERE `recipe_id` = '3'), '1');

INSERT INTO `Orders` (`order_id`, `order_date`, `order_status`, `customer_id`) VALUES 
('1003', '2020-02-20', 'PROCESSED', '2');
INSERT INTO `Recipes_in_Orders` (`order_id`, `recipe_id`, `item_number`) VALUES 
((SELECT `order_id` FROM `Orders` WHERE `order_date` = '2020-02-20' AND `customer_id` = '2'), 
(SELECT `recipe_id` FROM `Recipes` WHERE `recipe_id` = '1'), '1');
INSERT INTO `Recipes_in_Orders` (`order_id`, `recipe_id`, `item_number`) VALUES 
((SELECT `order_id` FROM `Orders` WHERE `order_date` = '2020-02-20' AND `customer_id` = '2'), 
(SELECT `recipe_id` FROM `Recipes` WHERE `recipe_id` = '2'), '2');
INSERT INTO `Recipes_in_Orders` (`order_id`, `recipe_id`, `item_number`) VALUES 
((SELECT `order_id` FROM `Orders` WHERE `order_date` = '2020-02-20' AND `customer_id` = '2'), 
(SELECT `recipe_id` FROM `Recipes` WHERE `recipe_id` = '3'), '3');