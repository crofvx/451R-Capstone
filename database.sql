USE [master]
GO
/****** Object:  Database [BankingAppDB]    Script Date: 5/7/2025 12:58:42 PM ******/
CREATE DATABASE [BankingAppDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'BankingAppDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\BankingAppDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'BankingAppDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\BankingAppDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [BankingAppDB] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [BankingAppDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [BankingAppDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [BankingAppDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [BankingAppDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [BankingAppDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [BankingAppDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [BankingAppDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [BankingAppDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [BankingAppDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [BankingAppDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [BankingAppDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [BankingAppDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [BankingAppDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [BankingAppDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [BankingAppDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [BankingAppDB] SET  ENABLE_BROKER 
GO
ALTER DATABASE [BankingAppDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [BankingAppDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [BankingAppDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [BankingAppDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [BankingAppDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [BankingAppDB] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [BankingAppDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [BankingAppDB] SET RECOVERY FULL 
GO
ALTER DATABASE [BankingAppDB] SET  MULTI_USER 
GO
ALTER DATABASE [BankingAppDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [BankingAppDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [BankingAppDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [BankingAppDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [BankingAppDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [BankingAppDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'BankingAppDB', N'ON'
GO
ALTER DATABASE [BankingAppDB] SET QUERY_STORE = ON
GO
ALTER DATABASE [BankingAppDB] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [BankingAppDB]
GO
/****** Object:  Table [dbo].[account_transfers]    Script Date: 5/7/2025 12:58:42 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[account_transfers](
	[account_no] [varchar](16) NOT NULL,
	[transaction_id] [uniqueidentifier] NOT NULL,
	[role] [varchar](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[account_no] ASC,
	[transaction_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[accounts]    Script Date: 5/7/2025 12:58:42 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[accounts](
	[account_no] [varchar](16) NOT NULL,
	[account_type] [varchar](10) NOT NULL,
	[creation_date] [date] NOT NULL,
	[balance] [decimal](18, 2) NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[account_no] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[budgets]    Script Date: 5/7/2025 12:58:42 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[budgets](
	[budget_id] [uniqueidentifier] NOT NULL,
	[category] [varchar](30) NOT NULL,
	[month] [int] NOT NULL,
	[year] [int] NOT NULL,
	[allocated_amount] [decimal](18, 2) NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[budget_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[password_reset_tokens]    Script Date: 5/7/2025 12:58:42 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[password_reset_tokens](
	[token_id] [uniqueidentifier] NOT NULL,
	[token] [varchar](255) NOT NULL,
	[expiration] [datetime] NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[token_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[single_account_transactions]    Script Date: 5/7/2025 12:58:42 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[single_account_transactions](
	[transaction_id] [uniqueidentifier] NOT NULL,
	[transaction_type] [varchar](10) NOT NULL,
	[transaction_date] [date] NOT NULL,
	[transaction_amount] [decimal](18, 2) NOT NULL,
	[description] [varchar](250) NOT NULL,
	[account_no] [varchar](16) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[transaction_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[transfer_transactions]    Script Date: 5/7/2025 12:58:42 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[transfer_transactions](
	[transaction_id] [uniqueidentifier] NOT NULL,
	[transaction_date] [date] NOT NULL,
	[transaction_amount] [decimal](18, 2) NOT NULL,
	[description] [varchar](250) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[transaction_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 5/7/2025 12:58:42 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[user_id] [uniqueidentifier] NOT NULL,
	[first_name] [varchar](50) NOT NULL,
	[last_name] [varchar](50) NOT NULL,
	[email] [varchar](254) NOT NULL,
	[phone] [varchar](10) NOT NULL,
	[address] [varchar](150) NOT NULL,
	[birth_date] [date] NOT NULL,
	[password] [varchar](128) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'5759703400622885', N'd46ae876-0e5b-422a-addf-02b582da9100', N'receiver')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'3223449101358663', N'd46ae876-0e5b-422a-addf-02b582da9100', N'sender')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'3759530380383279', N'0a033758-32db-462e-8949-1b56144b2aae', N'receiver')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'4410783433438991', N'0a033758-32db-462e-8949-1b56144b2aae', N'sender')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'3759530380383279', N'dfb98616-7663-4307-84f2-4a323efcdaab', N'receiver')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'4410783433438991', N'dfb98616-7663-4307-84f2-4a323efcdaab', N'sender')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'2374012417787967', N'63868bf8-1149-4e23-b8e1-5e24fd7b2120', N'receiver')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'1866613813870718', N'63868bf8-1149-4e23-b8e1-5e24fd7b2120', N'sender')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'3759530380383279', N'0e0e56b2-c5b0-4d14-aeda-71f5b0f2715f', N'receiver')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'4410783433438991', N'0e0e56b2-c5b0-4d14-aeda-71f5b0f2715f', N'sender')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'4410783433438991', N'fbcc1fe8-2b40-44a3-8490-9240a1552b25', N'receiver')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'3759530380383279', N'fbcc1fe8-2b40-44a3-8490-9240a1552b25', N'sender')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'8878874412422917', N'304c476a-9909-4d17-8dfe-925fee6fa1eb', N'receiver')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'8595899863335950', N'304c476a-9909-4d17-8dfe-925fee6fa1eb', N'sender')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'8595899863335950', N'a1746ec8-78bb-4393-a0f3-9abafa944e1f', N'receiver')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'8878874412422917', N'a1746ec8-78bb-4393-a0f3-9abafa944e1f', N'sender')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'8878874412422917', N'a8205c1b-a270-479f-995d-abc6227abb88', N'receiver')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'8595899863335950', N'a8205c1b-a270-479f-995d-abc6227abb88', N'sender')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'1866613813870718', N'a6308cf7-7e5e-4f54-9979-c1851ed5c04e', N'receiver')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'2374012417787967', N'a6308cf7-7e5e-4f54-9979-c1851ed5c04e', N'sender')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'8595899863335950', N'1e13afa1-eb17-4eaa-9d62-fcb095c10315', N'receiver')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'8878874412422917', N'1e13afa1-eb17-4eaa-9d62-fcb095c10315', N'sender')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'4410783433438991', N'3394b977-2483-4428-809b-ff6957270ec2', N'receiver')
INSERT [dbo].[account_transfers] ([account_no], [transaction_id], [role]) VALUES (N'3759530380383279', N'3394b977-2483-4428-809b-ff6957270ec2', N'sender')
GO
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'1866613813870718', N'checking', CAST(N'2025-04-15' AS Date), CAST(2127.50 AS Decimal(18, 2)), N'97816195-9e18-4dd4-821e-ac3ddacad908')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'2374012417787967', N'saving', CAST(N'2025-04-15' AS Date), CAST(1899.50 AS Decimal(18, 2)), N'97816195-9e18-4dd4-821e-ac3ddacad908')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'2996987526228450', N'saving', CAST(N'2025-04-23' AS Date), CAST(1496.00 AS Decimal(18, 2)), N'91902c48-b6be-4889-adb5-ae54bed28c8b')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'3038313962893869', N'saving', CAST(N'2025-04-15' AS Date), CAST(4669.00 AS Decimal(18, 2)), N'244d72d9-0a09-456f-a9f7-5606efcc6e9c')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'3223449101358663', N'checking', CAST(N'2025-05-02' AS Date), CAST(642.00 AS Decimal(18, 2)), N'b9458774-1f30-4c5b-90f5-26fe8c323757')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'3759530380383279', N'saving', CAST(N'2025-04-14' AS Date), CAST(2744.00 AS Decimal(18, 2)), N'af3e3074-44a3-456c-aafa-ad24255c40d9')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'4410783433438991', N'checking', CAST(N'2025-04-14' AS Date), CAST(1900.00 AS Decimal(18, 2)), N'af3e3074-44a3-456c-aafa-ad24255c40d9')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'4433235016775989', N'checking', CAST(N'2025-04-23' AS Date), CAST(935.00 AS Decimal(18, 2)), N'8f95a980-1875-48e7-a5e0-c437e6f6eeca')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'4489126467380715', N'checking', CAST(N'2025-04-15' AS Date), CAST(1466.00 AS Decimal(18, 2)), N'244d72d9-0a09-456f-a9f7-5606efcc6e9c')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'5759703400622885', N'saving', CAST(N'2025-05-02' AS Date), CAST(4955.00 AS Decimal(18, 2)), N'b9458774-1f30-4c5b-90f5-26fe8c323757')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'6399073019510413', N'saving', CAST(N'2025-04-23' AS Date), CAST(2808.00 AS Decimal(18, 2)), N'8f95a980-1875-48e7-a5e0-c437e6f6eeca')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'6954154036862282', N'saving', CAST(N'2025-04-09' AS Date), CAST(4131.00 AS Decimal(18, 2)), N'f45d238b-0c40-427e-81bd-5797e27a3ee3')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'7327269623253228', N'checking', CAST(N'2025-04-09' AS Date), CAST(1459.00 AS Decimal(18, 2)), N'f45d238b-0c40-427e-81bd-5797e27a3ee3')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'8195825862783313', N'checking', CAST(N'2025-04-23' AS Date), CAST(759.00 AS Decimal(18, 2)), N'91902c48-b6be-4889-adb5-ae54bed28c8b')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'8541388761517815', N'saving', CAST(N'2025-04-14' AS Date), CAST(2965.00 AS Decimal(18, 2)), N'f2b5de49-25f3-47a6-b37c-b1286bed643b')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'8595899863335950', N'checking', CAST(N'2025-04-23' AS Date), CAST(1068.00 AS Decimal(18, 2)), N'4d5aa9f2-2cf0-4fdb-a0e1-1cbe7ef58e96')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'8878874412422917', N'saving', CAST(N'2025-04-23' AS Date), CAST(1268.00 AS Decimal(18, 2)), N'4d5aa9f2-2cf0-4fdb-a0e1-1cbe7ef58e96')
INSERT [dbo].[accounts] ([account_no], [account_type], [creation_date], [balance], [user_id]) VALUES (N'9123125013548355', N'checking', CAST(N'2025-04-14' AS Date), CAST(859.00 AS Decimal(18, 2)), N'f2b5de49-25f3-47a6-b37c-b1286bed643b')
GO
INSERT [dbo].[budgets] ([budget_id], [category], [month], [year], [allocated_amount], [user_id]) VALUES (N'ad9229f7-340c-4595-8f65-0c946a7a2c1a', N'housing', 5, 2025, CAST(1500.00 AS Decimal(18, 2)), N'b9458774-1f30-4c5b-90f5-26fe8c323757')
INSERT [dbo].[budgets] ([budget_id], [category], [month], [year], [allocated_amount], [user_id]) VALUES (N'783cc86c-02e1-4e9c-8bdb-2cb851d60582', N'healthcare', 5, 2025, CAST(150.00 AS Decimal(18, 2)), N'af3e3074-44a3-456c-aafa-ad24255c40d9')
INSERT [dbo].[budgets] ([budget_id], [category], [month], [year], [allocated_amount], [user_id]) VALUES (N'1553deff-f398-4250-81e6-3f9a757cc80a', N'housing', 5, 2025, CAST(1500.00 AS Decimal(18, 2)), N'af3e3074-44a3-456c-aafa-ad24255c40d9')
INSERT [dbo].[budgets] ([budget_id], [category], [month], [year], [allocated_amount], [user_id]) VALUES (N'37d29565-894c-43c4-ab65-50c7d451a954', N'food', 5, 2025, CAST(300.00 AS Decimal(18, 2)), N'af3e3074-44a3-456c-aafa-ad24255c40d9')
INSERT [dbo].[budgets] ([budget_id], [category], [month], [year], [allocated_amount], [user_id]) VALUES (N'4f836398-c282-4c01-b111-50dc963ab0c6', N'transportation', 5, 2025, CAST(100.00 AS Decimal(18, 2)), N'af3e3074-44a3-456c-aafa-ad24255c40d9')
INSERT [dbo].[budgets] ([budget_id], [category], [month], [year], [allocated_amount], [user_id]) VALUES (N'a223efdd-027f-438f-af17-58fb3ba586fb', N'personal', 5, 2025, CAST(50.00 AS Decimal(18, 2)), N'af3e3074-44a3-456c-aafa-ad24255c40d9')
INSERT [dbo].[budgets] ([budget_id], [category], [month], [year], [allocated_amount], [user_id]) VALUES (N'd935409e-0e58-417b-a90b-b31e322f97c8', N'food', 5, 2025, CAST(100.00 AS Decimal(18, 2)), N'b9458774-1f30-4c5b-90f5-26fe8c323757')
INSERT [dbo].[budgets] ([budget_id], [category], [month], [year], [allocated_amount], [user_id]) VALUES (N'32d5a26f-5772-41da-9f60-be55207e5d35', N'savings', 5, 2025, CAST(50.00 AS Decimal(18, 2)), N'af3e3074-44a3-456c-aafa-ad24255c40d9')
GO
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'00434187-00c3-4dfb-a873-199c11624cce', N'deposit', CAST(N'2025-04-14' AS Date), CAST(3568.00 AS Decimal(18, 2)), N'Initial Deposit', N'3759530380383279')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'eac38993-64cc-4f8c-bf07-3463d2f45dc0', N'deposit', CAST(N'2025-04-15' AS Date), CAST(2997.00 AS Decimal(18, 2)), N'Initial Deposit', N'2374012417787967')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'f9199e91-33d6-44f9-90ef-38fd06e851bd', N'deposit', CAST(N'2025-05-02' AS Date), CAST(4855.00 AS Decimal(18, 2)), N'Initial Deposit', N'5759703400622885')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'381f29f4-039d-478f-a397-4673ce09b747', N'deposit', CAST(N'2025-04-14' AS Date), CAST(1076.00 AS Decimal(18, 2)), N'Initial Deposit', N'4410783433438991')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'499bdbab-ded1-4b26-af50-651a7d49cb52', N'deposit', CAST(N'2025-04-23' AS Date), CAST(1268.00 AS Decimal(18, 2)), N'Initial Deposit', N'8595899863335950')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'0e8f4099-9dbe-4225-a93b-6f8758a73aa7', N'deposit', CAST(N'2025-04-09' AS Date), CAST(4131.00 AS Decimal(18, 2)), N'Initial Deposit', N'6954154036862282')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'77ca64ca-5f7a-4314-8f56-7ea5fff5c74c', N'deposit', CAST(N'2025-04-23' AS Date), CAST(2808.00 AS Decimal(18, 2)), N'Initial Deposit', N'6399073019510413')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'407229c4-5cbb-484f-ae71-8d9052488953', N'deposit', CAST(N'2025-04-09' AS Date), CAST(1459.00 AS Decimal(18, 2)), N'Initial Deposit', N'7327269623253228')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'1f908639-00b7-49d0-9347-96ac098761ab', N'deposit', CAST(N'2025-04-15' AS Date), CAST(4669.00 AS Decimal(18, 2)), N'Initial Deposit', N'3038313962893869')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'995cbcf7-01e4-45c8-a23e-c5811a18440a', N'deposit', CAST(N'2025-04-15' AS Date), CAST(1466.00 AS Decimal(18, 2)), N'Initial Deposit', N'4489126467380715')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'dd4b63ac-4f47-4309-8cb4-c84ed24f6433', N'deposit', CAST(N'2025-04-14' AS Date), CAST(859.00 AS Decimal(18, 2)), N'Initial Deposit', N'9123125013548355')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'1c98975f-50f3-427a-91bd-d20304ce1fbb', N'deposit', CAST(N'2025-04-14' AS Date), CAST(2965.00 AS Decimal(18, 2)), N'Initial Deposit', N'8541388761517815')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'f13f8bad-4c57-4640-ab89-d6445ee0759e', N'deposit', CAST(N'2025-04-23' AS Date), CAST(1068.00 AS Decimal(18, 2)), N'Initial Deposit', N'8878874412422917')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'b192c869-9e0a-4c55-bf11-db9a73977e19', N'deposit', CAST(N'2025-04-23' AS Date), CAST(759.00 AS Decimal(18, 2)), N'Initial Deposit', N'8195825862783313')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'd763bdc1-0c2c-411c-9cdf-dd25d5274c73', N'deposit', CAST(N'2025-04-15' AS Date), CAST(1030.00 AS Decimal(18, 2)), N'Initial Deposit', N'1866613813870718')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'a49e9a54-2dda-46ca-9989-e3dc57ab2837', N'deposit', CAST(N'2025-04-23' AS Date), CAST(1496.00 AS Decimal(18, 2)), N'Initial Deposit', N'2996987526228450')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'aa54c620-498f-416d-a11a-fa803bdfa65c', N'deposit', CAST(N'2025-05-02' AS Date), CAST(742.00 AS Decimal(18, 2)), N'Initial Deposit', N'3223449101358663')
INSERT [dbo].[single_account_transactions] ([transaction_id], [transaction_type], [transaction_date], [transaction_amount], [description], [account_no]) VALUES (N'0da78380-6ff8-4dc1-adca-fa9d4e8f4fc9', N'deposit', CAST(N'2025-04-23' AS Date), CAST(935.00 AS Decimal(18, 2)), N'Initial Deposit', N'4433235016775989')
GO
INSERT [dbo].[transfer_transactions] ([transaction_id], [transaction_date], [transaction_amount], [description]) VALUES (N'd46ae876-0e5b-422a-addf-02b582da9100', CAST(N'2025-05-02' AS Date), CAST(100.00 AS Decimal(18, 2)), N'Transferred $100 from account 3223449101358663 to account 5759703400622885')
INSERT [dbo].[transfer_transactions] ([transaction_id], [transaction_date], [transaction_amount], [description]) VALUES (N'0a033758-32db-462e-8949-1b56144b2aae', CAST(N'2025-04-24' AS Date), CAST(144.00 AS Decimal(18, 2)), N'Transferred $144 from account 4410783433438991 to account 3759530380383279')
INSERT [dbo].[transfer_transactions] ([transaction_id], [transaction_date], [transaction_amount], [description]) VALUES (N'dfb98616-7663-4307-84f2-4a323efcdaab', CAST(N'2025-04-20' AS Date), CAST(76.00 AS Decimal(18, 2)), N'Transferred $76 from account 4410783433438991 to account 3759530380383279')
INSERT [dbo].[transfer_transactions] ([transaction_id], [transaction_date], [transaction_amount], [description]) VALUES (N'63868bf8-1149-4e23-b8e1-5e24fd7b2120', CAST(N'2025-04-26' AS Date), CAST(30.00 AS Decimal(18, 2)), N'Transferred $30 from account 1866613813870718 to account 2374012417787967')
INSERT [dbo].[transfer_transactions] ([transaction_id], [transaction_date], [transaction_amount], [description]) VALUES (N'0e0e56b2-c5b0-4d14-aeda-71f5b0f2715f', CAST(N'2025-04-21' AS Date), CAST(100.00 AS Decimal(18, 2)), N'Transferred $100 from account 4410783433438991 to account 3759530380383279')
INSERT [dbo].[transfer_transactions] ([transaction_id], [transaction_date], [transaction_amount], [description]) VALUES (N'fbcc1fe8-2b40-44a3-8490-9240a1552b25', CAST(N'2025-04-20' AS Date), CAST(500.00 AS Decimal(18, 2)), N'Transferred $500 from account 3759530380383279 to account 4410783433438991')
INSERT [dbo].[transfer_transactions] ([transaction_id], [transaction_date], [transaction_amount], [description]) VALUES (N'304c476a-9909-4d17-8dfe-925fee6fa1eb', CAST(N'2025-04-26' AS Date), CAST(500.00 AS Decimal(18, 2)), N'Transferred $500 from account 8595899863335950 to account 8878874412422917')
INSERT [dbo].[transfer_transactions] ([transaction_id], [transaction_date], [transaction_amount], [description]) VALUES (N'a1746ec8-78bb-4393-a0f3-9abafa944e1f', CAST(N'2025-04-26' AS Date), CAST(250.00 AS Decimal(18, 2)), N'Transferred $250 from account 8878874412422917 to account 8595899863335950')
INSERT [dbo].[transfer_transactions] ([transaction_id], [transaction_date], [transaction_amount], [description]) VALUES (N'a8205c1b-a270-479f-995d-abc6227abb88', CAST(N'2025-04-26' AS Date), CAST(100.00 AS Decimal(18, 2)), N'Transferred $100 from account 8595899863335950 to account 8878874412422917')
INSERT [dbo].[transfer_transactions] ([transaction_id], [transaction_date], [transaction_amount], [description]) VALUES (N'a6308cf7-7e5e-4f54-9979-c1851ed5c04e', CAST(N'2025-04-26' AS Date), CAST(1127.50 AS Decimal(18, 2)), N'Transferred $1127.50 from account 2374012417787967 to account 1866613813870718')
INSERT [dbo].[transfer_transactions] ([transaction_id], [transaction_date], [transaction_amount], [description]) VALUES (N'1e13afa1-eb17-4eaa-9d62-fcb095c10315', CAST(N'2025-04-26' AS Date), CAST(150.00 AS Decimal(18, 2)), N'Transferred $150 from account 8878874412422917 to account 8595899863335950')
INSERT [dbo].[transfer_transactions] ([transaction_id], [transaction_date], [transaction_amount], [description]) VALUES (N'3394b977-2483-4428-809b-ff6957270ec2', CAST(N'2025-04-20' AS Date), CAST(644.00 AS Decimal(18, 2)), N'Transferred $644 from account 3759530380383279 to account 4410783433438991')
GO
INSERT [dbo].[users] ([user_id], [first_name], [last_name], [email], [phone], [address], [birth_date], [password]) VALUES (N'4d5aa9f2-2cf0-4fdb-a0e1-1cbe7ef58e96', N'Naomi', N'Chen', N'naomi.chen75@fakeinbox.net', N'5556419038', N'456 Olive Grove Blvd, Santa Rosa, CA, 95407', CAST(N'1975-11-30' AS Date), N'$2a$10$BBNy/4U8jcW.3euWF5B3sOedvzu.clSwCypdX3ZfXckm5piroe4Kq')
INSERT [dbo].[users] ([user_id], [first_name], [last_name], [email], [phone], [address], [birth_date], [password]) VALUES (N'b9458774-1f30-4c5b-90f5-26fe8c323757', N'Christina', N'Forbes', N'clf12852@gmail.com', N'5551357924', N'890 Main St, Kansas City, MO, 64105', CAST(N'2000-05-22' AS Date), N'$2a$10$sulNNQXR8la0cHV4fDoiMOtfB/xQ6YmOR1HTiZPJDYEbk6Lty1sXq')
INSERT [dbo].[users] ([user_id], [first_name], [last_name], [email], [phone], [address], [birth_date], [password]) VALUES (N'244d72d9-0a09-456f-a9f7-5606efcc6e9c', N'Marcus', N'Lin', N'marcus.lin@testemail.com', N'5554083319', N'314 Oak St, Kansas City, MO, 64105', CAST(N'1984-02-24' AS Date), N'$2a$10$aCbYzya6Om4ezmkT5ruvFeAgS6VpZ/CCJjEEN6K2UyBLkJA1IfPnq')
INSERT [dbo].[users] ([user_id], [first_name], [last_name], [email], [phone], [address], [birth_date], [password]) VALUES (N'f45d238b-0c40-427e-81bd-5797e27a3ee3', N'cam', N'tiz', N'umkc@gmail.com', N'1234567645', N'43 S Street, City, IL, 55310', CAST(N'1932-01-23' AS Date), N'$2a$10$MiXG3IbWLPo1EyeNenEHcegikTOngMFhQfNd2iu90k7aT4HO22dFy')
INSERT [dbo].[users] ([user_id], [first_name], [last_name], [email], [phone], [address], [birth_date], [password]) VALUES (N'97816195-9e18-4dd4-821e-ac3ddacad908', N'Alina', N'Ramirez', N'alina.ramirez91@example.net', N'5557432810', N'1632 Pinecrest Avenue, Boulder, CO, 80302', CAST(N'1991-07-09' AS Date), N'$2a$10$tZPXtp2CoUj2CfBYh3ToLeOVzhe37ESfTIB8fwwjvd4GxUw8YE6oi')
INSERT [dbo].[users] ([user_id], [first_name], [last_name], [email], [phone], [address], [birth_date], [password]) VALUES (N'af3e3074-44a3-456c-aafa-ad24255c40d9', N'Christina', N'F', N'clf9wf@umkc.edu', N'5554162025', N'456 Maple St, Kansas City, MO, 64105', CAST(N'2000-04-14' AS Date), N'$2a$10$diUTjBCdd3iWQ2Tuy/2J6.smfTuO8umWzKCe4gFdPAx0EQsy/Oue2')
INSERT [dbo].[users] ([user_id], [first_name], [last_name], [email], [phone], [address], [birth_date], [password]) VALUES (N'91902c48-b6be-4889-adb5-ae54bed28c8b', N'Trevor', N'Grayson', N'trevor.grayson94@inboxtester.com', N'5552385067', N'1190 Riverbend Street, Fort Collins, CO, 80526', CAST(N'1990-08-18' AS Date), N'$2a$10$lvmayK2FULs8fJjsKnbJsO1g2gu9iCRtDwafEWicqj87nqWVC3gFm')
INSERT [dbo].[users] ([user_id], [first_name], [last_name], [email], [phone], [address], [birth_date], [password]) VALUES (N'f2b5de49-25f3-47a6-b37c-b1286bed643b', N'Kelsey', N'Harrison', N'test@example.com', N'5557771717', N'123 Main st ', CAST(N'2000-04-10' AS Date), N'$2a$10$.LUTs2wEpjTAi1oa60gAfe5945GyJu4GhbWyBhB.FW3TqOJH5yMoK')
INSERT [dbo].[users] ([user_id], [first_name], [last_name], [email], [phone], [address], [birth_date], [password]) VALUES (N'8f95a980-1875-48e7-a5e0-c437e6f6eeca', N'Priya', N'Nair', N'priya.nair.test88@fakemailbox.com', N'5553679420', N'785 Indigo Creek Dr, Beaverton, OR, 97006', CAST(N'1988-12-06' AS Date), N'$2a$10$lPwSA0ZmvoriQl.XnEZo5uDQljWaWmFnhoizKmwxoeNhwJ6xmSqHC')
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [uq_transactionRole]    Script Date: 5/7/2025 12:58:42 PM ******/
ALTER TABLE [dbo].[account_transfers] ADD  CONSTRAINT [uq_transactionRole] UNIQUE NONCLUSTERED 
(
	[transaction_id] ASC,
	[role] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [uq_userBudget]    Script Date: 5/7/2025 12:58:42 PM ******/
ALTER TABLE [dbo].[budgets] ADD  CONSTRAINT [uq_userBudget] UNIQUE NONCLUSTERED 
(
	[user_id] ASC,
	[category] ASC,
	[month] ASC,
	[year] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__password__CA90DA7ABC6183AC]    Script Date: 5/7/2025 12:58:42 PM ******/
ALTER TABLE [dbo].[password_reset_tokens] ADD UNIQUE NONCLUSTERED 
(
	[token] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__password__CA90DA7AF8CB064D]    Script Date: 5/7/2025 12:58:42 PM ******/
ALTER TABLE [dbo].[password_reset_tokens] ADD UNIQUE NONCLUSTERED 
(
	[token] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__users__AB6E6164597BA4B3]    Script Date: 5/7/2025 12:58:42 PM ******/
ALTER TABLE [dbo].[users] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__users__AB6E6164E6A84863]    Script Date: 5/7/2025 12:58:42 PM ******/
ALTER TABLE [dbo].[users] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[account_transfers]  WITH CHECK ADD  CONSTRAINT [fk_accountTransferAccount] FOREIGN KEY([account_no])
REFERENCES [dbo].[accounts] ([account_no])
GO
ALTER TABLE [dbo].[account_transfers] CHECK CONSTRAINT [fk_accountTransferAccount]
GO
ALTER TABLE [dbo].[account_transfers]  WITH CHECK ADD  CONSTRAINT [fk_accountTransferTransaction] FOREIGN KEY([transaction_id])
REFERENCES [dbo].[transfer_transactions] ([transaction_id])
GO
ALTER TABLE [dbo].[account_transfers] CHECK CONSTRAINT [fk_accountTransferTransaction]
GO
ALTER TABLE [dbo].[accounts]  WITH CHECK ADD  CONSTRAINT [fk_userID] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[accounts] CHECK CONSTRAINT [fk_userID]
GO
ALTER TABLE [dbo].[budgets]  WITH CHECK ADD  CONSTRAINT [fk_budgetUser] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[budgets] CHECK CONSTRAINT [fk_budgetUser]
GO
ALTER TABLE [dbo].[password_reset_tokens]  WITH CHECK ADD  CONSTRAINT [fk_userID_tokens] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[password_reset_tokens] CHECK CONSTRAINT [fk_userID_tokens]
GO
ALTER TABLE [dbo].[single_account_transactions]  WITH CHECK ADD  CONSTRAINT [fk_transactionAccountNo] FOREIGN KEY([account_no])
REFERENCES [dbo].[accounts] ([account_no])
GO
ALTER TABLE [dbo].[single_account_transactions] CHECK CONSTRAINT [fk_transactionAccountNo]
GO
ALTER TABLE [dbo].[account_transfers]  WITH CHECK ADD  CONSTRAINT [chk_transferRole] CHECK  (([role]='receiver' OR [role]='sender'))
GO
ALTER TABLE [dbo].[account_transfers] CHECK CONSTRAINT [chk_transferRole]
GO
ALTER TABLE [dbo].[accounts]  WITH CHECK ADD  CONSTRAINT [chk_accountNo] CHECK  (([account_no] like '[0-9]%'))
GO
ALTER TABLE [dbo].[accounts] CHECK CONSTRAINT [chk_accountNo]
GO
ALTER TABLE [dbo].[accounts]  WITH CHECK ADD  CONSTRAINT [chk_accountType] CHECK  (([account_type]='saving' OR [account_type]='checking'))
GO
ALTER TABLE [dbo].[accounts] CHECK CONSTRAINT [chk_accountType]
GO
ALTER TABLE [dbo].[budgets]  WITH CHECK ADD  CONSTRAINT [chk_budgetCategory] CHECK  (([category]='miscellaneous' OR [category]='personal' OR [category]='savings' OR [category]='debt' OR [category]='healthcare' OR [category]='food' OR [category]='transportation' OR [category]='housing'))
GO
ALTER TABLE [dbo].[budgets] CHECK CONSTRAINT [chk_budgetCategory]
GO
ALTER TABLE [dbo].[budgets]  WITH CHECK ADD CHECK  (([month]>=(1) AND [month]<=(12)))
GO
ALTER TABLE [dbo].[budgets]  WITH CHECK ADD CHECK  (([month]>=(1) AND [month]<=(12)))
GO
ALTER TABLE [dbo].[single_account_transactions]  WITH CHECK ADD  CONSTRAINT [chk_transactionType] CHECK  (([transaction_type]='withdraw' OR [transaction_type]='deposit'))
GO
ALTER TABLE [dbo].[single_account_transactions] CHECK CONSTRAINT [chk_transactionType]
GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD  CONSTRAINT [chk_phone] CHECK  (([phone] like '[0-9]%'))
GO
ALTER TABLE [dbo].[users] CHECK CONSTRAINT [chk_phone]
GO
USE [master]
GO
ALTER DATABASE [BankingAppDB] SET  READ_WRITE 
GO
