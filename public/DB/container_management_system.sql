-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 01, 2025 at 09:29 PM
-- Server version: 8.0.43-0ubuntu0.24.04.1
-- PHP Version: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `container_management_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `controls`
--

CREATE TABLE `controls` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nature_of_account` enum('A','L','I','R','E') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `controls`
--

INSERT INTO `controls` (`id`, `name`, `nature_of_account`, `created_at`, `updated_at`) VALUES
(3, 'ASSETS', 'A', '2025-08-18 22:32:17', '2025-08-18 22:32:17'),
(4, 'Liabilities', 'L', '2025-08-18 22:32:25', '2025-08-18 22:32:25'),
(5, 'Expenses', 'E', '2025-08-18 22:32:44', '2025-08-18 22:32:44'),
(6, 'Income', 'I', '2025-08-18 22:32:49', '2025-08-18 22:32:49'),
(7, 'Equity', 'R', '2025-08-29 11:29:24', '2025-08-29 11:29:43');

-- --------------------------------------------------------

--
-- Table structure for table `cros`
--

CREATE TABLE `cros` (
  `id` bigint UNSIGNED NOT NULL,
  `containers_count` bigint NOT NULL,
  `cro_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cros`
--

INSERT INTO `cros` (`id`, `containers_count`, `cro_no`, `date`, `created_at`, `updated_at`) VALUES
(1, 5, '55221133', '2025-07-31 19:00:00', '2025-08-17 06:47:03', '2025-08-31 10:58:53');

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

CREATE TABLE `currencies` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'PKR', '2025-08-17 06:34:05', '2025-08-17 06:34:05'),
(2, 'USD', '2025-08-17 06:34:05', '2025-08-17 06:34:05'),
(3, 'AED', '2025-08-17 06:34:05', '2025-08-17 06:34:05');

-- --------------------------------------------------------

--
-- Table structure for table `custom_clearances`
--

CREATE TABLE `custom_clearances` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `tel_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `details`
--

CREATE TABLE `details` (
  `id` bigint UNSIGNED NOT NULL,
  `control_id` bigint UNSIGNED NOT NULL,
  `subsidary_id` bigint UNSIGNED NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_cash` enum('cash','bank') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_details` text COLLATE utf8mb4_unicode_ci,
  `address` text COLLATE utf8mb4_unicode_ci,
  `ntn_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `strn_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cnic_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `opening_balance` decimal(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `details`
--

INSERT INTO `details` (`id`, `control_id`, `subsidary_id`, `code`, `account_code`, `title`, `bank_cash`, `other_details`, `address`, `ntn_no`, `strn_no`, `email`, `mobile_no`, `cnic_no`, `created_at`, `updated_at`, `opening_balance`) VALUES
(7, 3, 5, '301001', '3-01-001', 'Bank A', 'bank', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-18 22:36:55', '2025-08-19 12:56:20', -500.00),
(8, 3, 5, '301002', '3-01-002', 'Bank B', 'bank', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-18 22:37:01', '2025-08-18 22:37:01', NULL),
(9, 3, 6, '302001', '3-02-001', 'Cash in Hand', 'cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-18 22:37:12', '2025-08-18 22:37:12', NULL),
(10, 3, 7, '303001', '3-03-001', 'Customer A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-18 22:37:30', '2025-08-18 22:37:30', NULL),
(11, 3, 7, '303002', '3-03-002', 'Customer B', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-18 22:37:42', '2025-08-18 22:37:42', NULL),
(12, 4, 8, '401001', '4-01-001', 'C/C payable A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-18 22:38:28', '2025-08-18 22:38:28', NULL),
(13, 4, 9, '402001', '4-02-001', 'Freight Forwarders Payable', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-18 22:38:42', '2025-08-18 22:38:42', NULL),
(14, 4, 8, '401002', '4-01-002', 'Custom Clearance', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-18 22:41:59', '2025-08-22 00:12:46', NULL),
(15, 4, 10, '403001', '4-03-001', 'Transporter', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-18 22:42:10', '2025-08-18 22:42:10', NULL),
(16, 4, 11, '404001', '4-04-001', 'Supplier', NULL, 'THis is FOr Testing', NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-18 22:42:22', '2025-08-31 10:27:23', -5000.00),
(17, 5, 16, '505001', '5-05-001', 'dadadadada', 'cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-26 07:02:43', '2025-08-26 07:02:43', 2.00),
(18, 3, 5, '301003', '3-01-003', 'Bank C', 'bank', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-27 08:12:10', '2025-08-27 08:12:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_07_30_170314_create_units_table', 1),
(5, '2025_07_31_052141_create_shipping_lines_table', 1),
(6, '2025_07_31_082847_create_vendors_table', 1),
(7, '2025_07_31_084557_create_transporters_table', 1),
(8, '2025_07_31_093104_create_custom_clearances_table', 1),
(9, '2025_07_31_095019_create_products_table', 1),
(10, '2025_08_04_193420_create_currencies_table', 1),
(11, '2025_08_04_193434_create_stock_ins_table', 1),
(12, '2025_08_06_164745_create_stock_outs_table', 1),
(13, '2025_08_08_074345_update_stock_ins_table', 1),
(14, '2025_08_09_074243_create_controls_table', 1),
(15, '2025_08_09_201840_create_subsidaries_table', 1),
(16, '2025_08_09_215223_create_details_table', 1),
(17, '2025_08_11_091748_create_cros_table', 1),
(18, '2025_08_11_103327_update_stock_ins_table', 1),
(19, '2025_08_14_135632_create_vouchers_table', 1),
(20, '2025_08_15_202500_create_receipt_vouchers_table', 1),
(21, '2025_08_16_050900_update_details_table', 1),
(22, '2025_08_17_101320_update_controls_table', 1),
(23, '2025_08_17_103233_update_subsidaries_table', 1),
(24, '2025_08_17_105911_update_stock_ins_table', 1),
(25, '2025_08_31_153754_update_products_table', 2),
(30, '2025_08_31_154440_update_stock_ins_table', 3),
(33, '2025_09_01_020417_update_stock_outs_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `hs_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `unit_id`, `created_at`, `updated_at`, `hs_code`) VALUES
(1, 'WHEAT', 1, '2025-08-17 06:39:35', '2025-08-31 10:43:24', 'ART-55055'),
(2, 'sadsad', 1, '2025-08-31 10:42:49', '2025-08-31 10:42:49', '23123213');

-- --------------------------------------------------------

--
-- Table structure for table `receipt_vouchers`
--

CREATE TABLE `receipt_vouchers` (
  `id` bigint UNSIGNED NOT NULL,
  `receipt_date` timestamp NOT NULL,
  `receipt_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `received_from` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `received_details` text COLLATE utf8mb4_unicode_ci,
  `received_by` enum('cash','bank') COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_details` json DEFAULT NULL,
  `cash_details` json DEFAULT NULL,
  `detail_id` bigint UNSIGNED DEFAULT NULL,
  `currency_id` bigint UNSIGNED DEFAULT NULL,
  `amount` decimal(20,2) NOT NULL,
  `exchange_rate` decimal(20,4) NOT NULL,
  `total_amount` decimal(20,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `receipt_vouchers`
--

INSERT INTO `receipt_vouchers` (`id`, `receipt_date`, `receipt_no`, `received_from`, `received_details`, `received_by`, `bank_details`, `cash_details`, `detail_id`, `currency_id`, `amount`, `exchange_rate`, `total_amount`, `created_at`, `updated_at`) VALUES
(2, '2025-08-01 19:00:00', 'R0002/2025', 'SHEIKH', 'TESTING', 'bank', '{\"bank_id\": 7, \"cheque_no\": null, \"cheque_date\": null}', '{\"chequebook_id\": null}', 9, 1, 20.00, 1.0000, 20.00, '2025-08-22 16:30:20', '2025-08-22 16:30:54');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('4ZD0rN1Hux4WbLVxA6yELFEl3XLvPpmIkFlkM8bG', 1, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiNGNSNUtBSndnYVc0WDY5Umhwck5NdUVjYU1WcENWdFJMUjhlZzhZQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC90cmFuc2FjdGlvbnMvc3RvY2stb3V0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czozOiJ1cmwiO2E6MDp7fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1756676358);

-- --------------------------------------------------------

--
-- Table structure for table `shipping_lines`
--

CREATE TABLE `shipping_lines` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `tel_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shipping_lines`
--

INSERT INTO `shipping_lines` (`id`, `name`, `email`, `contact_person`, `address`, `tel_no`, `mobile_no`, `created_at`, `updated_at`) VALUES
(1, 'SHEIKH MUHAMMAD ABDULLAH', 'abdullahsheikhmuhammad21@gmail.com', NULL, NULL, NULL, NULL, '2025-08-17 06:39:24', '2025-08-17 06:39:24');

-- --------------------------------------------------------

--
-- Table structure for table `stock_ins`
--

CREATE TABLE `stock_ins` (
  `id` bigint UNSIGNED NOT NULL,
  `entry_date` timestamp NOT NULL,
  `container_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vehicle_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cro_id` bigint UNSIGNED DEFAULT NULL,
  `container_size` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `port_location` enum('KICT','KDGL') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vendor_id` bigint UNSIGNED DEFAULT NULL,
  `product_id` bigint UNSIGNED DEFAULT NULL,
  `product_weight` decimal(20,2) NOT NULL,
  `product_unit_id` bigint UNSIGNED DEFAULT NULL,
  `product_weight_in_man` decimal(20,2) NOT NULL,
  `product_no_of_bundles` int NOT NULL,
  `product_rate` decimal(20,2) NOT NULL,
  `product_total_amount` decimal(20,2) NOT NULL,
  `transporter_id` bigint UNSIGNED DEFAULT NULL,
  `transporter_rate` decimal(20,2) DEFAULT NULL,
  `custom_clearance_id` bigint UNSIGNED DEFAULT NULL,
  `custom_clearance_rate` decimal(20,2) DEFAULT NULL,
  `freight_forwarder_id` bigint UNSIGNED DEFAULT NULL,
  `freight_forwarder_rate` decimal(20,2) DEFAULT NULL,
  `fc_amount` decimal(20,2) DEFAULT NULL,
  `exchange_rate` decimal(20,2) DEFAULT NULL,
  `currency_id` bigint UNSIGNED DEFAULT NULL,
  `all_in_one` tinyint(1) NOT NULL DEFAULT '0',
  `total_amount` decimal(20,2) NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock_ins`
--

INSERT INTO `stock_ins` (`id`, `entry_date`, `container_no`, `vehicle_no`, `cro_id`, `container_size`, `port_location`, `vendor_id`, `product_id`, `product_weight`, `product_unit_id`, `product_weight_in_man`, `product_no_of_bundles`, `product_rate`, `product_total_amount`, `transporter_id`, `transporter_rate`, `custom_clearance_id`, `custom_clearance_rate`, `freight_forwarder_id`, `freight_forwarder_rate`, `fc_amount`, `exchange_rate`, `currency_id`, `all_in_one`, `total_amount`, `note`, `created_at`, `updated_at`) VALUES
(31, '2025-07-31 19:00:00', '12345678', '12345678', 1, NULL, 'KICT', 16, 1, 20.00, 1, 0.50, 50, 100.00, 50.00, NULL, 0.00, NULL, 0.00, 13, 20000.00, 200.00, 100.00, 1, 1, 20050.00, NULL, '2025-08-22 11:47:15', '2025-08-31 13:38:53'),
(32, '2025-08-01 19:00:00', '1232222', NULL, 1, '40\'', 'KICT', 16, 1, 200.00, 1, 5.00, 500, 100.00, 500.00, 15, 500.00, 14, 500.00, 13, 20000.00, 200.00, 100.00, 2, 0, 21500.00, NULL, '2025-08-31 10:48:42', '2025-08-31 18:42:44'),
(33, '2025-07-31 19:00:00', '12323213213', NULL, 1, 'HC', 'KICT', 16, 1, 200.00, 1, 5.00, 2000, 200.00, 1000.00, 15, 500.00, 12, 20000.00, 13, 50000.00, 500.00, 100.00, 1, 0, 71500.00, NULL, '2025-08-31 14:42:52', '2025-08-31 18:42:36'),
(34, '2025-07-31 19:00:00', '123456785464465', '12345678', 1, '20\'', 'KDGL', 16, 1, 3333.00, 1, 83.33, 2222, 22222.00, 1851648.15, 15, 222.00, 12, 222.00, 13, 484.00, 22.00, 22.00, 2, 0, 1852576.15, NULL, '2025-08-31 14:45:05', '2025-08-31 14:45:05');

-- --------------------------------------------------------

--
-- Table structure for table `stock_outs`
--

CREATE TABLE `stock_outs` (
  `id` bigint UNSIGNED NOT NULL,
  `bl_date` timestamp NOT NULL,
  `bl_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` bigint UNSIGNED DEFAULT NULL,
  `currency_id` bigint UNSIGNED DEFAULT NULL,
  `exchange_rate` decimal(20,4) NOT NULL,
  `containers` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock_outs`
--

INSERT INTO `stock_outs` (`id`, `bl_date`, `bl_no`, `account_id`, `currency_id`, `exchange_rate`, `containers`, `created_at`, `updated_at`) VALUES
(1, '2025-07-31 19:00:00', '55888777445232', 7, 1, 200.0000, '[{\"container_id\": 31, \"container_no\": \"12345678\", \"total_amount\": \"100.25\"}]', '2025-08-31 10:30:14', '2025-08-31 21:39:18'),
(2, '2025-09-05 19:00:00', '2313213', 20, 1, 200.0000, '[{\"container_id\": 32, \"container_no\": \"1232222\", \"total_amount\": \"107.50\"}]', '2025-08-31 21:08:53', '2025-08-31 21:08:53'),
(3, '2025-09-19 19:00:00', '312321313', 7, 3, 500.0000, '[{\"container_id\": 33, \"container_no\": \"12323213213\", \"total_amount\": \"143.00\"}]', '2025-08-31 21:09:31', '2025-08-31 21:09:31');

-- --------------------------------------------------------

--
-- Table structure for table `subsidaries`
--

CREATE TABLE `subsidaries` (
  `id` bigint UNSIGNED NOT NULL,
  `control_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_category` enum('V','T','C','F','R') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subsidaries`
--

INSERT INTO `subsidaries` (`id`, `control_id`, `name`, `code`, `account_code`, `account_category`, `created_at`, `updated_at`) VALUES
(5, 3, 'Bank', '301', '3-01', NULL, '2025-08-18 22:33:43', '2025-08-18 22:33:43'),
(6, 3, 'Cash', '302', '3-02', NULL, '2025-08-18 22:33:50', '2025-08-18 22:33:50'),
(7, 3, 'Receivables', '303', '3-03', 'R', '2025-08-18 22:33:57', '2025-08-31 20:53:18'),
(8, 4, 'Custom Clr. Payable', '401', '4-01', 'C', '2025-08-18 22:34:15', '2025-08-18 22:34:15'),
(9, 4, 'Freight Forwarders Payable', '402', '4-02', 'F', '2025-08-18 22:34:27', '2025-08-18 22:34:27'),
(10, 4, 'Transport Payable', '403', '4-03', 'T', '2025-08-18 22:34:37', '2025-08-18 22:34:37'),
(11, 4, 'Wheat Straw Suppliers', '404', '4-04', 'V', '2025-08-18 22:34:47', '2025-08-18 22:34:47'),
(12, 5, 'Administrative Expenses', '501', '5-01', NULL, '2025-08-18 22:34:59', '2025-08-18 22:34:59'),
(13, 5, 'Salaries, Wages and Benefits', '502', '5-02', NULL, '2025-08-18 22:35:05', '2025-08-18 22:35:05'),
(14, 5, 'Communication', '503', '5-03', NULL, '2025-08-18 22:35:09', '2025-08-18 22:35:09'),
(15, 5, 'Office Expenses', '504', '5-04', NULL, '2025-08-18 22:35:18', '2025-08-18 22:35:57'),
(16, 5, 'Financial Charges', '505', '5-05', NULL, '2025-08-18 22:35:24', '2025-08-18 22:35:24'),
(17, 5, 'Revenue and Income', '506', '5-06', NULL, '2025-08-18 22:35:28', '2025-08-18 22:35:28'),
(20, 5, 'Receivables 2', '507', '5-07', 'R', '2025-08-31 20:53:35', '2025-08-31 20:53:35');

-- --------------------------------------------------------

--
-- Table structure for table `transporters`
--

CREATE TABLE `transporters` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `tel_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'KG', '2025-08-17 06:39:19', '2025-08-17 06:39:19');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin', NULL, '$2y$12$rBA2aVQ4AwztUNJEP4mzpuQCPOpgE0L/WLrxpEpVSDHmVw4CDfhgK', NULL, '2025-08-17 06:34:04', '2025-08-17 06:34:04');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `tel_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` bigint UNSIGNED NOT NULL,
  `payment_date` timestamp NOT NULL,
  `payment_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paid_to` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_details` text COLLATE utf8mb4_unicode_ci,
  `payment_by` enum('cash','bank') COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_details` json DEFAULT NULL,
  `cash_details` json DEFAULT NULL,
  `detail_id` bigint UNSIGNED DEFAULT NULL,
  `currency_id` bigint UNSIGNED DEFAULT NULL,
  `amount` decimal(20,2) NOT NULL,
  `exchange_rate` decimal(20,4) NOT NULL,
  `total_amount` decimal(20,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vouchers`
--

INSERT INTO `vouchers` (`id`, `payment_date`, `payment_no`, `paid_to`, `payment_details`, `payment_by`, `bank_details`, `cash_details`, `detail_id`, `currency_id`, `amount`, `exchange_rate`, `total_amount`, `created_at`, `updated_at`) VALUES
(1, '2025-08-18 19:00:00', 'P0001/2025', 'SHEIKH', 'This for tsting', 'bank', '{\"bank_id\": 7, \"cheque_no\": null, \"cheque_date\": null}', '{\"chequebook_id\": null}', 14, 1, 10.00, 1.0000, 10.00, '2025-08-18 23:43:23', '2025-08-19 12:42:26'),
(2, '2025-07-31 19:00:00', 'P0002/2025', 'MEE', NULL, 'bank', '{\"bank_id\": 7, \"cheque_no\": null, \"cheque_date\": null}', '{\"chequebook_id\": null}', 14, 2, 200.00, 10.0000, 2000.00, '2025-08-18 23:58:48', '2025-08-19 01:39:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `controls`
--
ALTER TABLE `controls`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cros`
--
ALTER TABLE `cros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cros_cro_no_unique` (`cro_no`);

--
-- Indexes for table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `custom_clearances`
--
ALTER TABLE `custom_clearances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `custom_clearances_email_unique` (`email`);

--
-- Indexes for table `details`
--
ALTER TABLE `details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `details_control_id_foreign` (`control_id`),
  ADD KEY `details_subsidary_id_foreign` (`subsidary_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_unit_id_foreign` (`unit_id`);

--
-- Indexes for table `receipt_vouchers`
--
ALTER TABLE `receipt_vouchers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `receipt_vouchers_detail_id_foreign` (`detail_id`),
  ADD KEY `receipt_vouchers_currency_id_foreign` (`currency_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `shipping_lines`
--
ALTER TABLE `shipping_lines`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `shipping_lines_email_unique` (`email`);

--
-- Indexes for table `stock_ins`
--
ALTER TABLE `stock_ins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stock_ins_container_no_unique` (`container_no`),
  ADD KEY `stock_ins_product_id_foreign` (`product_id`),
  ADD KEY `stock_ins_product_unit_id_foreign` (`product_unit_id`),
  ADD KEY `stock_ins_currency_id_foreign` (`currency_id`),
  ADD KEY `stock_ins_cro_id_foreign` (`cro_id`),
  ADD KEY `stock_ins_vendor_id_foreign` (`vendor_id`),
  ADD KEY `stock_ins_freight_forwarder_id_foreign` (`freight_forwarder_id`),
  ADD KEY `stock_ins_transporter_id_foreign` (`transporter_id`),
  ADD KEY `stock_ins_custom_clearance_id_foreign` (`custom_clearance_id`);

--
-- Indexes for table `stock_outs`
--
ALTER TABLE `stock_outs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stock_outs_bl_no_unique` (`bl_no`),
  ADD KEY `stock_outs_currency_id_foreign` (`currency_id`),
  ADD KEY `stock_outs_account_id_foreign` (`account_id`);

--
-- Indexes for table `subsidaries`
--
ALTER TABLE `subsidaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subsidaries_control_id_foreign` (`control_id`);

--
-- Indexes for table `transporters`
--
ALTER TABLE `transporters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transporters_email_unique` (`email`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_name_unique` (`name`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vendors_email_unique` (`email`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vouchers_detail_id_foreign` (`detail_id`),
  ADD KEY `vouchers_currency_id_foreign` (`currency_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `controls`
--
ALTER TABLE `controls`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `cros`
--
ALTER TABLE `cros`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `custom_clearances`
--
ALTER TABLE `custom_clearances`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `details`
--
ALTER TABLE `details`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `receipt_vouchers`
--
ALTER TABLE `receipt_vouchers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `shipping_lines`
--
ALTER TABLE `shipping_lines`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stock_ins`
--
ALTER TABLE `stock_ins`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `stock_outs`
--
ALTER TABLE `stock_outs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subsidaries`
--
ALTER TABLE `subsidaries`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `transporters`
--
ALTER TABLE `transporters`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `details`
--
ALTER TABLE `details`
  ADD CONSTRAINT `details_control_id_foreign` FOREIGN KEY (`control_id`) REFERENCES `controls` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `details_subsidary_id_foreign` FOREIGN KEY (`subsidary_id`) REFERENCES `subsidaries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `receipt_vouchers`
--
ALTER TABLE `receipt_vouchers`
  ADD CONSTRAINT `receipt_vouchers_currency_id_foreign` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `receipt_vouchers_detail_id_foreign` FOREIGN KEY (`detail_id`) REFERENCES `details` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `stock_ins`
--
ALTER TABLE `stock_ins`
  ADD CONSTRAINT `stock_ins_cro_id_foreign` FOREIGN KEY (`cro_id`) REFERENCES `cros` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_ins_currency_id_foreign` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_ins_custom_clearance_id_foreign` FOREIGN KEY (`custom_clearance_id`) REFERENCES `details` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_ins_freight_forwarder_id_foreign` FOREIGN KEY (`freight_forwarder_id`) REFERENCES `details` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_ins_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_ins_product_unit_id_foreign` FOREIGN KEY (`product_unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_ins_transporter_id_foreign` FOREIGN KEY (`transporter_id`) REFERENCES `details` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_ins_vendor_id_foreign` FOREIGN KEY (`vendor_id`) REFERENCES `details` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `stock_outs`
--
ALTER TABLE `stock_outs`
  ADD CONSTRAINT `stock_outs_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `subsidaries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_outs_currency_id_foreign` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `subsidaries`
--
ALTER TABLE `subsidaries`
  ADD CONSTRAINT `subsidaries_control_id_foreign` FOREIGN KEY (`control_id`) REFERENCES `controls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD CONSTRAINT `vouchers_currency_id_foreign` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `vouchers_detail_id_foreign` FOREIGN KEY (`detail_id`) REFERENCES `details` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
