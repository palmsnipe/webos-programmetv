-- phpMyAdmin SQL Dump
-- version 3.3.7deb6
-- http://www.phpmyadmin.net
--
-- Serveur: localhost
-- Généré le : Sam 07 Juillet 2012 à 20:35
-- Version du serveur: 5.1.49
-- Version de PHP: 5.3.3-7+squeeze3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `programmetv`
--
CREATE DATABASE `programmetv` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `programmetv`;

-- --------------------------------------------------------

--
-- Structure de la table `bouquet`
--

CREATE TABLE IF NOT EXISTS `bouquet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `country` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

-- --------------------------------------------------------

--
-- Structure de la table `bouquet_channels`
--

CREATE TABLE IF NOT EXISTS `bouquet_channels` (
  `nb` int(11) NOT NULL,
  `id_channel` varchar(255) NOT NULL,
  `id_bouquet` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

-- --------------------------------------------------------

--
-- Structure de la table `category_channel`
--

CREATE TABLE IF NOT EXISTS `category_channel` (
  `id_channel` varchar(255) NOT NULL,
  `id_category` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `channel`
--

CREATE TABLE IF NOT EXISTS `channel` (
  `full` varchar(255) CHARACTER SET latin1 NOT NULL,
  `nb` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET latin1 NOT NULL,
  `name2` varchar(255) CHARACTER SET latin1 NOT NULL,
  `group` varchar(255) CHARACTER SET latin1 NOT NULL,
  `id` varchar(255) CHARACTER SET latin1 NOT NULL,
  `category` varchar(255) CHARACTER SET latin1 NOT NULL,
  `country` varchar(255) CHARACTER SET latin1 NOT NULL,
  `source` varchar(20) COLLATE latin1_general_ci NOT NULL,
  UNIQUE KEY `name` (`name`,`name2`,`country`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `channel_be`
--

CREATE TABLE IF NOT EXISTS `channel_be` (
  `channel` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `id` varchar(255) COLLATE utf8_swedish_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `channel_canalsat`
--

CREATE TABLE IF NOT EXISTS `channel_canalsat` (
  `channel` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `nb` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `channel_ch`
--

CREATE TABLE IF NOT EXISTS `channel_ch` (
  `channel` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `nb` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `channel_chfr`
--

CREATE TABLE IF NOT EXISTS `channel_chfr` (
  `channel` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `nb` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `channel_de`
--

CREATE TABLE IF NOT EXISTS `channel_de` (
  `channel` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `id` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `nb` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `channel_en`
--

CREATE TABLE IF NOT EXISTS `channel_en` (
  `channel` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `nb` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `channel_es`
--

CREATE TABLE IF NOT EXISTS `channel_es` (
  `channel` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `nb` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `channel_fr`
--

CREATE TABLE IF NOT EXISTS `channel_fr` (
  `channel` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `nb` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `channel_it`
--

CREATE TABLE IF NOT EXISTS `channel_it` (
  `channel` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `nb` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `channel_old`
--

CREATE TABLE IF NOT EXISTS `channel_old` (
  `full` varchar(255) CHARACTER SET latin1 NOT NULL,
  `nb` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET latin1 NOT NULL,
  `name2` varchar(255) CHARACTER SET latin1 NOT NULL,
  `group` varchar(255) CHARACTER SET latin1 NOT NULL,
  `id` varchar(255) CHARACTER SET latin1 NOT NULL,
  `category` varchar(255) CHARACTER SET latin1 NOT NULL,
  `country` varchar(255) CHARACTER SET latin1 NOT NULL,
  `source` varchar(20) COLLATE latin1_general_ci NOT NULL,
  UNIQUE KEY `name` (`name`,`name2`,`country`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `country`
--

CREATE TABLE IF NOT EXISTS `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Structure de la table `programme`
--

CREATE TABLE IF NOT EXISTS `programme` (
  `channel` varchar(255) NOT NULL,
  `start` datetime NOT NULL,
  `stop` datetime NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` text NOT NULL,
  `desc` text NOT NULL,
  `date` year(4) NOT NULL,
  `category` varchar(255) NOT NULL,
  `director` varchar(255) NOT NULL,
  `presenter` varchar(255) NOT NULL,
  `actors` text NOT NULL,
  `rating` varchar(255) NOT NULL,
  `length` int(11) NOT NULL,
  UNIQUE KEY `channel` (`channel`,`start`,`stop`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `programme_be`
--

CREATE TABLE IF NOT EXISTS `programme_be` (
  `start` datetime NOT NULL,
  `stop` datetime NOT NULL,
  `channel` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `desc` text COLLATE utf8_swedish_ci NOT NULL,
  `director` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `actors` text COLLATE utf8_swedish_ci NOT NULL,
  `date` date NOT NULL,
  `categories` text COLLATE utf8_swedish_ci NOT NULL,
  `length` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `programme_canalsat`
--

CREATE TABLE IF NOT EXISTS `programme_canalsat` (
  `start` datetime NOT NULL,
  `stop` datetime NOT NULL,
  `channel` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `desc` text COLLATE utf8_swedish_ci NOT NULL,
  `director` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `actors` text COLLATE utf8_swedish_ci NOT NULL,
  `date` date NOT NULL,
  `categories` text COLLATE utf8_swedish_ci NOT NULL,
  `length` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `programme_ch`
--

CREATE TABLE IF NOT EXISTS `programme_ch` (
  `start` datetime NOT NULL,
  `stop` datetime NOT NULL,
  `channel` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `desc` text COLLATE utf8_swedish_ci NOT NULL,
  `director` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `actors` text COLLATE utf8_swedish_ci NOT NULL,
  `date` date NOT NULL,
  `categories` text COLLATE utf8_swedish_ci NOT NULL,
  `length` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `programme_chfr`
--

CREATE TABLE IF NOT EXISTS `programme_chfr` (
  `start` datetime NOT NULL,
  `stop` datetime NOT NULL,
  `channel` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `desc` text COLLATE utf8_swedish_ci NOT NULL,
  `director` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `actors` text COLLATE utf8_swedish_ci NOT NULL,
  `date` date NOT NULL,
  `categories` text COLLATE utf8_swedish_ci NOT NULL,
  `length` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `programme_de`
--

CREATE TABLE IF NOT EXISTS `programme_de` (
  `start` datetime NOT NULL,
  `stop` datetime NOT NULL,
  `channel` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `desc` text COLLATE utf8_swedish_ci NOT NULL,
  `director` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `actors` text COLLATE utf8_swedish_ci NOT NULL,
  `date` date NOT NULL,
  `categories` text COLLATE utf8_swedish_ci NOT NULL,
  `length` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `programme_en`
--

CREATE TABLE IF NOT EXISTS `programme_en` (
  `start` datetime NOT NULL,
  `stop` datetime NOT NULL,
  `channel` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `desc` text COLLATE utf8_swedish_ci NOT NULL,
  `director` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `actors` text COLLATE utf8_swedish_ci NOT NULL,
  `date` date NOT NULL,
  `categories` text COLLATE utf8_swedish_ci NOT NULL,
  `length` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `programme_es`
--

CREATE TABLE IF NOT EXISTS `programme_es` (
  `start` datetime NOT NULL,
  `stop` datetime NOT NULL,
  `channel` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `desc` text COLLATE utf8_swedish_ci NOT NULL,
  `director` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `actors` text COLLATE utf8_swedish_ci NOT NULL,
  `date` date NOT NULL,
  `categories` text COLLATE utf8_swedish_ci NOT NULL,
  `length` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `programme_fr`
--

CREATE TABLE IF NOT EXISTS `programme_fr` (
  `start` datetime NOT NULL,
  `stop` datetime NOT NULL,
  `channel` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `desc` text COLLATE utf8_swedish_ci NOT NULL,
  `director` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `actors` text COLLATE utf8_swedish_ci NOT NULL,
  `date` date NOT NULL,
  `categories` text COLLATE utf8_swedish_ci NOT NULL,
  `length` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `programme_it`
--

CREATE TABLE IF NOT EXISTS `programme_it` (
  `start` datetime NOT NULL,
  `stop` datetime NOT NULL,
  `channel` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `desc` text COLLATE utf8_swedish_ci NOT NULL,
  `director` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `actors` text COLLATE utf8_swedish_ci NOT NULL,
  `date` date NOT NULL,
  `categories` text COLLATE utf8_swedish_ci NOT NULL,
  `length` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `stat`
--

CREATE TABLE IF NOT EXISTS `stat` (
  `view` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `catalog` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `model` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `platformVersion` varchar(10) COLLATE utf8_swedish_ci NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `serial` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `carrier` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `appVersion` varchar(10) COLLATE utf8_swedish_ci NOT NULL,
  `appVersionStatus` varchar(255) COLLATE utf8_swedish_ci NOT NULL,
  `date` datetime NOT NULL,
  `userDate` datetime NOT NULL,
  `lang` varchar(20) COLLATE utf8_swedish_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;
