-- The : character is used to denote user submitted data and data from backend code

-- Select all recipes to display on Browse Recipes page. Also retrieves the average rating that 
-- exists for the recipe
SELECT `recipe_name`, `time`, `difficulty`, IFNULL(TRUNCATE(AVG(`rating`), 1), 'Not Yet Rated') AS `rating` FROM `Recipes` 
LEFT JOIN `Recipe_Ratings` ON `Recipes`.`recipe_id`=`Recipe_Ratings`.`recipe_id`
GROUP BY `Recipes`.`recipe_id`;

-- Select recipes that meet search criteria user entered in time dropdown
-- to display on Browse Recipes page
SELECT `recipe_id`, `recipe_name`, `time`, `difficulty` FROM `Recipes` WHERE `time` < :timeInput;

-- Display order history for a customer with current order status
SELECT `Orders`.`order_id`, DATE_FORMAT(`Orders`.`order_date`, '%m/%d/%Y') AS `order_date`, DATE_FORMAT(`Orders`.`delivery_date`, '%m/%d/%Y') AS `delivery_date`, `Orders`.`order_status`, `Recipes`.`recipe_name` FROM Orders
LEFT JOIN `Recipes_in_Orders` ON `Orders`.`order_id`=`Recipes_in_Orders`.`order_id`
LEFT JOIN `Recipes` ON `Recipes_in_Orders`.`recipe_id`=`Recipes`.`recipe_id`
WHERE `Orders`.`customer_id` = :customerIdInput
ORDER BY `Orders`.`order_id` DESC

-- Check that user is a registered customer when user logs in
SELECT `customer_id` FROM `Customers`
WHERE `email` = :emailInput AND `password` = :passwordInput;

-- Display customer's current account information from Customers table
SELECT `first_name`, `last_name`, `email`, `phone`, `admin` FROM `Customers`
WHERE `customer_id` = :customerIdInput;

-- Retrieve Order ID when order has been placed
SELECT `order_id` FROM `Orders`
WHERE `customer_id` = :customerIdInput
ORDER BY `order_date` DESC
LIMIT 1;

-- Display recipes the customer has ordered previously and the rating
-- the customer gave each recipe if it exists
SELECT `Recipes`.`recipe_id`, `Recipes`.`recipe_name`, `Recipe_Ratings`.`rating`, DATE_FORMAT(`Recipe_Ratings`.`date_rated`, '%m/%d/%Y') AS `date_rated` FROM `Recipes_in_Orders` JOIN
`Recipes` ON `Recipes_in_Orders`.`recipe_id`=`Recipes`.`recipe_id`
LEFT JOIN `Orders` ON `Recipes_in_Orders`.`order_id`=`Orders`.`order_id`
LEFT JOIN `Recipe_Ratings` ON (`Orders`.`customer_id`=`Recipe_Ratings`.`customer_id` AND `Recipes_in_Orders`.`recipe_id`=`Recipe_Ratings`.`recipe_id`)
WHERE `Orders`.`customer_id`= :customerIdInput
GROUP BY `Recipes`.`recipe_name`
ORDER BY `Orders`.`order_date` DESC

-- Delete record from Recipes_in_Orders table
-- Order ID is retrieved from form/button on order history table
DELETE FROM `Recipes_in_Orders` WHERE `order_id` = :orderIdInput;

-- Pair above with Update order status of Order that has been canceled
UPDATE Orders SET order_status = 'CANCELED'
WHERE `order_id` = :orderIdInput;

-- Remove relationship between Recipe_Rating and Customer if customer 
-- chooses to remove his/her recipe rating
UPDATE `Recipe_Ratings` SET `customer_id` = NULL 
WHERE `customer_id` = :customerIdInput;

-- Add record to Customers table when customer registers for account
INSERT INTO `Customers` (`first_name`, `last_name`, `email`, `password`, `phone`, `admin`) VALUES 
(:fnameInput, :lnameInput, :emailInput, :passwordInput, :phoneInput, '0');

-- Add record to Recipes when admin adds a recipe
INSERT INTO `Recipes` (`recipe_name`, `time`, `difficulty`, `directions`) VALUES
(:recipenameInput, :recipetimeInput, :recipedifficultyInput, :recipedirectionsInput); 

-- Add record to Orders table when customer places an order
INSERT INTO `Orders` (`order_date`, `delivery_date`, `order_status`, `customer_id`) VALUES 
((SYSDATE()), NULL, 'PROCESSED', :customerIdInput);

-- Add record to Recipes_in_Orders immediately after customer places the order
-- Order ID is retrieved from form/button on Recipes_in_Orders table
INSERT INTO `Recipes_in_Orders` (`recipe_id`, `order_id`, `item_number`) VALUES 
(:recipeIdInput, :orderIdInput, :itemNumberInput);

--Add record to Recipe_Ratings when customer adds a rating to a recipe.
INSERT INTO `Recipe_Ratings` (`rating`, `date_rated`, `customer_id`, `recipe_id`) VALUES 
(:ratingInput, (SYSDATE()), :customerIdInput, :recipeIdInput);

-- Update customer information
UPDATE `Customers`
SET `first_name` = :fnameInput, `last_name` = :lnameInput, `email` = :emailInput, `password` = :passwordInput, `phone` = :phoneInput
WHERE `customer_id` = :customerIdInput;

-- Update customer recipe rating
UPDATE `Recipe_Ratings`
SET `rating` = :ratingInput, `date_rated` = (SYSDATE())
WHERE `customer_id` = :customerIdInput AND `recipe_id` = :recipeIdInput;


