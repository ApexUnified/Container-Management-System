-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 10, 2025 at 07:18 AM
-- Server version: 8.0.42
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
(1, 'Assets', 'A', '2025-08-13 03:28:22', '2025-08-17 12:18:49'),
(2, 'Liabilities', 'L', '2025-08-13 03:28:31', '2025-08-17 16:40:26'),
(3, 'Equity', 'R', '2025-08-13 03:28:47', '2025-08-29 16:08:02'),
(4, 'Expenses', 'E', '2025-08-13 03:29:00', '2025-08-17 16:41:04'),
(5, 'Income', 'I', '2025-08-13 03:29:13', '2025-08-17 16:41:17');

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
(1, 4, '55221133', '2025-08-07 00:00:00', '2025-08-11 16:59:30', '2025-08-21 17:57:12'),
(2, 10, '01', '2025-08-29 00:00:00', '2025-08-29 17:55:43', '2025-08-29 17:55:43');

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
(1, 'PKR', '2025-08-15 11:58:41', '2025-08-15 11:58:41'),
(2, 'USD', '2025-08-15 11:58:41', '2025-08-15 11:58:41'),
(3, 'AED', '2025-08-15 11:58:41', '2025-08-15 11:58:41');

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

--
-- Dumping data for table `custom_clearances`
--

INSERT INTO `custom_clearances` (`id`, `name`, `email`, `contact_person`, `address`, `tel_no`, `mobile_no`, `created_at`, `updated_at`) VALUES
(1, 'SHEIKH MUHAMMAD ABDULLAH', 'abdullahsheikhmuhammad21@gmail.com', NULL, NULL, NULL, NULL, '2025-08-11 17:00:09', '2025-08-11 17:00:09'),
(2, 'Salman', NULL, NULL, NULL, NULL, NULL, '2025-08-14 17:35:51', '2025-08-14 17:35:51'),
(3, 'Khadim', NULL, NULL, NULL, NULL, NULL, '2025-08-14 17:36:19', '2025-08-14 17:36:19');

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
(1, 1, 1, '101001', '1-01-001', 'Bank A', 'bank', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:34:07', '2025-08-13 03:34:07', NULL),
(2, 1, 1, '101002', '1-01-002', 'Bank B', 'bank', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:34:48', '2025-08-13 03:34:48', NULL),
(3, 1, 2, '102001', '1-02-001', 'Cash in Hand', 'cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:35:10', '2025-08-13 03:35:10', NULL),
(4, 1, 3, '103001', '1-03-001', 'Customer A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:35:27', '2025-08-13 03:35:27', NULL),
(5, 1, 3, '103002', '1-03-002', 'Customer B', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:35:39', '2025-08-13 03:35:39', NULL),
(6, 2, 4, '201001', '2-01-001', 'Irfan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:35:55', '2025-08-22 20:29:17', NULL),
(7, 2, 5, '202001', '2-02-001', 'Salman', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:36:10', '2025-08-22 20:28:04', NULL),
(8, 2, 6, '203001', '2-03-001', 'Rafique', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:36:23', '2025-08-22 20:26:42', NULL),
(9, 2, 7, '204001', '2-04-001', 'Kashif', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:36:38', '2025-08-22 20:24:12', 0.00),
(10, 4, 8, '401001', '4-01-001', 'Admin Expense 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:36:58', '2025-08-13 03:36:58', NULL),
(11, 4, 9, '402001', '4-02-001', 'Staff Salaries', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:37:21', '2025-08-13 03:37:21', NULL),
(12, 4, 9, '402002', '4-02-002', 'Staff Welfare', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:37:38', '2025-08-13 03:37:38', NULL),
(13, 4, 11, '404001', '4-04-001', 'Office Repair and Maint.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:37:56', '2025-08-13 03:37:56', NULL),
(14, 4, 11, '404002', '4-04-002', 'Office Rent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:38:14', '2025-08-13 03:38:14', NULL),
(15, 4, 12, '405001', '4-05-001', 'Bank Charges', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:38:27', '2025-08-13 03:38:27', NULL),
(16, 4, 12, '405002', '4-05-002', 'Audit Fee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:38:43', '2025-08-13 03:38:43', NULL),
(17, 5, 13, '501001', '5-01-001', 'Sale Income', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 03:39:26', '2025-08-13 03:39:26', NULL),
(25, 2, 7, '204002', '2-04-002', 'Haroon', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:24:43', '2025-08-22 20:24:43', NULL),
(26, 2, 7, '204003', '2-04-003', 'Ahmed', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:24:52', '2025-08-22 20:24:52', NULL),
(27, 2, 7, '204004', '2-04-004', 'Hussain Hameed', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:25:07', '2025-08-22 20:25:07', NULL),
(28, 2, 7, '204005', '2-04-005', 'Haroon Tando M Khan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:25:23', '2025-08-22 20:25:23', NULL),
(29, 2, 7, '204006', '2-04-006', 'Asif Tando M Khan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:25:37', '2025-08-22 20:25:37', NULL),
(30, 2, 7, '204007', '2-04-007', 'Roman', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:25:45', '2025-08-22 20:25:45', NULL),
(31, 2, 6, '203002', '2-03-002', 'Asif', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:27:04', '2025-08-22 20:27:04', NULL),
(32, 2, 6, '203003', '2-03-003', 'Mudassir', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:27:14', '2025-08-22 20:27:14', NULL),
(33, 2, 6, '203004', '2-03-004', 'Salman', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:27:26', '2025-08-22 20:27:26', NULL),
(34, 2, 6, '203005', '2-03-005', 'Irfan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:27:31', '2025-08-22 20:27:31', NULL),
(35, 2, 6, '203006', '2-03-006', 'Tariq', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:27:36', '2025-08-22 20:27:36', NULL),
(36, 2, 5, '202002', '2-02-002', 'Irfan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:28:27', '2025-08-22 20:28:27', NULL),
(37, 2, 5, '202003', '2-02-003', 'Tariq', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:28:36', '2025-08-22 20:28:36', NULL),
(38, 2, 5, '202004', '2-02-004', 'Shoaib', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:28:46', '2025-08-22 20:28:46', NULL),
(39, 2, 5, '202005', '2-02-005', 'Aqeel', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:28:51', '2025-08-22 20:28:51', NULL),
(40, 2, 4, '201002', '2-01-002', 'Tariq', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:29:40', '2025-08-22 20:29:40', NULL),
(41, 2, 4, '201003', '2-01-003', 'Husnain Enterprises', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:29:52', '2025-08-22 20:29:52', NULL),
(42, 2, 4, '201004', '2-01-004', 'Salman', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 20:30:07', '2025-08-22 20:30:07', NULL),
(43, 2, 7, '204008', '2-04-008', 'Tahir', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-28 07:29:56', '2025-08-28 07:29:56', NULL),
(44, 2, 14, '205001', '2-05-001', 'Pawan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-29 17:53:59', '2025-08-29 17:53:59', NULL);

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
(36, '0001_01_01_000000_create_users_table', 1),
(37, '0001_01_01_000001_create_cache_table', 1),
(38, '0001_01_01_000002_create_jobs_table', 1),
(39, '2025_07_30_170314_create_units_table', 1),
(40, '2025_07_31_052141_create_shipping_lines_table', 1),
(41, '2025_07_31_082847_create_vendors_table', 1),
(42, '2025_07_31_084557_create_transporters_table', 1),
(43, '2025_07_31_093104_create_custom_clearances_table', 1),
(44, '2025_07_31_095019_create_products_table', 1),
(45, '2025_08_04_193420_create_currencies_table', 1),
(46, '2025_08_04_193434_create_stock_ins_table', 1),
(47, '2025_08_06_164745_create_stock_outs_table', 1),
(48, '2025_08_08_074345_update_stock_ins_table', 1),
(49, '2025_08_09_074243_create_controls_table', 1),
(50, '2025_08_09_201840_create_subsidaries_table', 1),
(51, '2025_08_09_215223_create_details_table', 1),
(52, '2025_08_11_091748_create_cros_table', 1),
(53, '2025_08_11_103327_update_stock_ins_table', 1),
(56, '2025_08_14_135632_create_vouchers_table', 2),
(57, '2025_08_15_202500_create_receipt_vouchers_table', 3),
(58, '2025_08_16_050900_update_details_table', 4),
(59, '2025_08_17_101320_update_controls_table', 4),
(60, '2025_08_17_103233_update_subsidaries_table', 4),
(61, '2025_08_17_105911_update_stock_ins_table', 5),
(62, '2025_08_31_153754_update_products_table', 6),
(63, '2025_08_31_154440_update_stock_ins_table', 6),
(64, '2025_09_01_020417_update_stock_outs_table', 7);

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
(1, 'WHEAT', 1, '2025-08-11 17:00:18', '2025-08-11 17:00:18', NULL);

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
(1, '2025-08-01 00:00:00', 'R0001/2025', 'SHEIKH', NULL, 'bank', '{\"bank_id\": 2, \"cheque_no\": null, \"cheque_date\": null}', '{\"chequebook_id\": null}', 2, 2, 500.00, 33.0000, 16500.00, '2025-08-15 21:55:02', '2025-08-15 21:56:02');

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
('0kNqDsksMj3RNGZUcx0zhjWWGCkcuNdQfGRC4jlY', 1, '162.158.22.31', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiWEFHcWw0TDFsR1ZoVHluVzRHSWFYRzZVdHpHTE1ET255dTdMSEV0ZCI7czozOiJ1cmwiO2E6MDp7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1756695942),
('scR7UOMRqVQ8TY2p3aKHZSZoie0VrGz6sOFtzmYS', 1, '162.158.23.31', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoidVdYWVdDc25JdWFMNTJOZndwT2ZBbFRzOHBacUJ1R0xpYjdaSm1VdSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHBzOi8vc21hLWRldnNpdGUuc2l0ZS9jbXMvc2V0dXBzL3VuaXRzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czozOiJ1cmwiO2E6MDp7fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1756773971),
('zmJ2XM8TMGy20vEE9K4oXAO3ZJZHQskUCwRFvn0W', 1, '172.70.108.82', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiOVNFb3lhNXA5dmVCZE9UbVlabmlhbm5oYXZYakJ4cWliMU1jMkp3RSI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czo1MDoiaHR0cHM6Ly9zbWEtZGV2c2l0ZS5zaXRlL2Ntcy90cmFuc2FjdGlvbnMvc3RvY2staW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1756676623);

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
(1, 'SHEIKH MUHAMMAD ABDULLAH', 'abdullahsheikhmuhammad21@gmail.com', NULL, NULL, NULL, NULL, '2025-08-11 16:59:53', '2025-08-11 16:59:53'),
(2, 'Salman', NULL, NULL, NULL, NULL, NULL, '2025-08-14 17:36:39', '2025-08-14 17:36:39');

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
(5, '2025-08-05 00:00:00', '120000', 'dddd', 1, NULL, 'KICT', 9, 1, 10.00, 1, 0.25, 50, 200.00, 50.00, 8, 1111.00, 6, 1111.00, 7, 49284.00, 222.00, 222.00, 2, 0, 51556.00, 'rr', '2025-08-20 09:37:19', '2025-08-31 15:58:20'),
(6, '2025-08-01 00:00:00', '123456782', '12345678', 1, NULL, 'KICT', 9, 1, 200.00, 1, 5.00, 200, 100.00, 500.00, 8, 200.00, 6, 100.00, 7, 20000.00, 200.00, 100.00, 1, 0, 20800.00, NULL, '2025-08-20 15:11:06', '2025-08-31 15:58:15'),
(7, '2025-08-21 00:00:00', 'cccccccc', 'wwwww', 1, NULL, 'KICT', 9, 1, 11000.00, 1, 275.00, 500, 240.00, 66000.00, 8, 30000.00, 6, 120000.00, 7, 62160.00, 222.00, 280.00, 2, 0, 278160.00, NULL, '2025-08-21 17:58:22', '2025-08-31 15:58:08'),
(8, '2025-08-29 00:00:00', 'FSCU 6534466', 'TLU 422', 2, '20\'', 'KICT', 26, 1, 21375.00, 1, 534.38, 1019, 770.00, 411468.75, 8, 65000.00, 41, 43000.00, 7, 84390.00, 290.00, 291.00, 2, 0, 603858.75, NULL, '2025-08-29 18:31:15', '2025-08-31 23:40:00'),
(9, '2025-08-02 00:00:00', '23123213213', '12345678', 1, '20\'', 'KDGL', 9, 1, 200.00, 1, 5.00, 200, 2400.00, 12000.00, 8, 500.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 12500.00, NULL, '2025-08-31 20:18:14', '2025-08-31 23:47:57');

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
(5, '2025-08-29 00:00:00', '1', 3, 3, 79.5000, '[{\"container_id\": 8, \"container_no\": \"FSCU 6534466\", \"total_amount\": \"7595.71\"}]', '2025-08-29 18:32:55', '2025-09-01 02:43:43');

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
(1, 1, 'Bank', '101', '1-01', NULL, '2025-08-13 03:29:47', '2025-08-17 12:19:49'),
(2, 1, 'Cash', '102', '1-02', NULL, '2025-08-13 03:29:58', '2025-08-13 03:29:58'),
(3, 1, 'Receivables', '103', '1-03', 'R', '2025-08-13 03:30:15', '2025-09-01 02:43:26'),
(4, 2, 'Custom Clr. Payable', '201', '2-01', 'C', '2025-08-13 03:30:32', '2025-08-17 16:41:59'),
(5, 2, 'Freight Forwarders Payable', '202', '2-02', 'F', '2025-08-13 03:30:51', '2025-08-17 16:42:09'),
(6, 2, 'Transport Payable', '203', '2-03', 'T', '2025-08-13 03:31:04', '2025-08-17 16:42:16'),
(7, 2, 'Wheat Straw Suppliers', '204', '2-04', 'V', '2025-08-13 03:31:30', '2025-08-17 16:42:24'),
(8, 4, 'Administrative Expenses', '401', '4-01', NULL, '2025-08-13 03:31:53', '2025-08-13 03:31:53'),
(9, 4, 'Salaries, Wages and Benefits', '402', '4-02', NULL, '2025-08-13 03:32:16', '2025-08-13 03:32:16'),
(10, 4, 'Communication', '403', '4-03', NULL, '2025-08-13 03:32:36', '2025-08-13 03:32:36'),
(11, 4, 'Office Expenses', '404', '4-04', NULL, '2025-08-13 03:32:50', '2025-08-13 03:32:50'),
(12, 4, 'Financial Charges', '405', '4-05', NULL, '2025-08-13 03:33:06', '2025-08-13 03:33:06'),
(13, 5, 'Revenue and Income', '501', '5-01', NULL, '2025-08-13 03:33:24', '2025-08-13 03:33:24'),
(14, 2, 'Rice Husk', '205', '2-05', NULL, '2025-08-29 17:53:12', '2025-08-29 17:53:12');

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

--
-- Dumping data for table `transporters`
--

INSERT INTO `transporters` (`id`, `name`, `email`, `contact_person`, `address`, `tel_no`, `mobile_no`, `created_at`, `updated_at`) VALUES
(1, 'SHEIKH MUHAMMAD ABDULLAH', 'abdullahsheikhmuhammad21@gmail.com', NULL, NULL, NULL, NULL, '2025-08-11 17:00:05', '2025-08-11 17:00:05'),
(2, 'Rafique', NULL, NULL, NULL, NULL, NULL, '2025-08-14 17:35:32', '2025-08-14 17:35:32');

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
(1, 'KG', '2025-08-11 16:59:48', '2025-08-11 16:59:48');

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
(1, 'Admin', NULL, '$2y$12$SuZNI0HwwU6F2u8OeJHv3eNEkYrFGIHSQwFj7Spxw57I5DrJ7zo1O', 'XYHee20RAJkCnMFNKH0GVzeaUCrVTpYwvph0ubVRca78UPhRZK5q9szWK4Jf', '2025-08-11 16:58:35', '2025-08-11 16:58:35');

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

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `name`, `email`, `contact_person`, `address`, `tel_no`, `mobile_no`, `created_at`, `updated_at`) VALUES
(1, 'SHEIKH MUHAMMAD ABDULLAH', 'abdullahsheikhmuhammad21@gmail.com', NULL, NULL, NULL, NULL, '2025-08-11 16:59:59', '2025-08-11 16:59:59'),
(2, 'Kashif', NULL, NULL, NULL, NULL, NULL, '2025-08-14 17:35:10', '2025-08-14 17:35:10'),
(3, 'Tahir', NULL, NULL, NULL, NULL, NULL, '2025-08-27 17:57:02', '2025-08-27 17:57:02');

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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `cros`
--
ALTER TABLE `cros`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `custom_clearances`
--
ALTER TABLE `custom_clearances`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `details`
--
ALTER TABLE `details`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

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
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `receipt_vouchers`
--
ALTER TABLE `receipt_vouchers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `shipping_lines`
--
ALTER TABLE `shipping_lines`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `stock_ins`
--
ALTER TABLE `stock_ins`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `stock_outs`
--
ALTER TABLE `stock_outs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `subsidaries`
--
ALTER TABLE `subsidaries`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `transporters`
--
ALTER TABLE `transporters`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
