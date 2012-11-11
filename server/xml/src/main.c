/*
** main.c for  in /home/morale_c/Documents/programmetv
** 
** Made by cyril morales
** Login   <morale_c@epitech.net>
** 
** Started on  Sun Nov 13 10:17:43 2011 cyril morales
** Last update Wed Jan 18 23:16:04 2012 cyril morales
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <my_global.h>
#include <mysql.h>
#include <m_string.h>
#include <libxml/tree.h>
#include <libxml/parser.h>

void		parseChannel(MYSQL *sql, xmlNodePtr racine, char *source, char *country)
{
  xmlNodePtr	child;
  int		i = 0;
  char		id[30];
  char		full[30];
  char		name[30];
  char		name2[30];
  char		group[200];
  char		nb[4];
  char		insert[1024];

  id[0] = '\0';
  full[0] = '\0';
  name[0] = '\0';
  name2[0] = '\0';
  group[0] = '\0';
  nb[0] = '\0';

  strcpy(id, (char*)xmlGetProp(racine, (xmlChar*)"id"));
  child = racine->children;
  while (child != NULL) {
    if (child->type == XML_ELEMENT_NODE) {
      if (strcmp((char*)child->name, "display-name") == 0) {
	if (i == 0)
	  strcpy(full, (char*)xmlNodeGetContent(child));
	else if (i == 1)
	  strcpy(nb, (char*)xmlNodeGetContent(child));
	else if (i == 2)
	  strcpy(name, (char*)xmlNodeGetContent(child));
	else if (i == 3)
	  strcpy(name2, (char*)xmlNodeGetContent(child));
	else if (i == 4)
	  strcpy(group, (char*)xmlNodeGetContent(child));
	i++;
      }
    }
    child = child->next;
  }
  // printf("group = %s\n", group);
  /* sprintf(insert, "INSERT IGNORE INTO channel(id, full, nb, name, name2, group, category, country) VALUES('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')", id, full, nb, name, name2, group, "", country); */
  sprintf(insert, "INSERT IGNORE INTO channel(id, full, nb, name, name2, country, source) VALUES('%s', '%s', '%s', '%s', '%s', '%s', '%s')", id, full, nb, name, name2, country, source);

  mysql_query(sql, insert);
}

void		parseProgramme(MYSQL *mysql, xmlNodePtr racine)
{
  xmlNodePtr	child;
  xmlNodePtr	child2;
  char		*end;
  char		start[14];
  char		stop[14];
  char		channel[30];
  xmlChar		*title = NULL;
  /* char		title[255]; */
  xmlChar		*subtitle = NULL;
  /* char		subtitle[2048]; */
  xmlChar		*desc = NULL;
  /* char		desc[4096]; */
  xmlChar		*date = NULL;
  /* char		date[4]; */
  xmlChar		*director = NULL;
  /* char		director[255]; */
  char		presenter[255];
  /* char		presenter[255]; */
  char		actors[2048];
  char		category[1024];
  char		length[3];
  char		rating[20];
  char		query[10000];
  // char		timezone[15];
  /* char		*emptyDate = "0000"; */
  char		*empty = "";

  /* title[0] = '\0'; */
  /* desc[0] = '\0'; */
  channel[0] = '\0';
  /* subtitle[0] = '\0'; */
  category[0] = '\0';
  actors[0] = '\0';
  /* director[0] = '\0'; */
  presenter[0] = '\0';
  length[0] = '\0';
  /* date[0] = '\0'; */
  rating[0] = '\0';

  strcpy(channel, (char*)xmlGetProp(racine, (xmlChar*)"channel"));
  strncpy(start, (char*)xmlGetProp(racine, (xmlChar*)"start"), 14);
  strncpy(stop, (char*)xmlGetProp(racine, (xmlChar*)"stop"), 14);
  
  child = racine->children;
  while (child != NULL) {
    if (child->type == XML_ELEMENT_NODE) {
      if (strcmp((char*)child->name, "title") == 0) {
	{
	  title = xmlNodeGetContent(child);
	  /* strcpy(title, (char*)xmlNodeGetContent(child)); */
	}
      }
      else if (strcmp((char*)child->name, "sub-title") == 0) {
	{
	  subtitle = xmlNodeGetContent(child);
	  /* strcpy(subtitle, (char*)xmlNodeGetContent(child)); */
	}
      }
      else if (strcmp((char*)child->name, "desc") == 0) {
	{
	  desc = xmlNodeGetContent(child);
	  /* strcpy(desc, (char*)xmlNodeGetContent(child)); */
	}
      }
      else if (strcmp((char*)child->name, "date") == 0) {
	{
	  date = xmlNodeGetContent(child);
	  /* strncpy(date, (char*)xmlNodeGetContent(child), 4); */
	}
      }
      else if (strcmp((char*)child->name, "length") == 0) {
	strcpy(length, (char*)xmlNodeGetContent(child));
      }
      else if (strcmp((char*)child->name, "credits") == 0) {
	child2 = child->children;
	while (child2 != NULL) {
	  if (child2->type == XML_ELEMENT_NODE) {
	    if (strcmp((char*)child2->name, "director") == 0) {
	      {
		director = xmlNodeGetContent(child2);
		/* strcpy(director, (char*)xmlNodeGetContent(child2)); */
	      }
	    }
	    else if (strcmp((char*)child2->name, "presenter") == 0) {
	      if (strlen(presenter) > 0) {
	      	strcat(presenter, ",");
	      }
	      strcat(presenter, (char*)xmlNodeGetContent(child2));
	    }
	    else if (strcmp((char*)child2->name, "actor") == 0) {
	      if (strlen(actors) > 0) {
	      	strcat(actors, ",");
	      }
	      strcat(actors, (char*)xmlNodeGetContent(child2));
	    }
	  }
	  child2 = child2->next;
	}
      }
      else if (strcmp((char*)child->name, "star-rating") == 0) {
	child2 = child->children;
	while (child2 != NULL) {
	  if (child2->type == XML_ELEMENT_NODE) {
	    if (strcmp((char*)child2->name, "value") == 0) {
	      strcpy(rating, (char*)xmlNodeGetContent(child2));
	    }
	  }
	  child2 = child2->next;
	}
      }
      else if (strcmp((char*)child->name, "category") == 0) {
	if (strlen(category) > 0) {
	  strcat(category, ",");
	}
	strcat(category, (char*)xmlNodeGetContent(child));
      }
    }
    child = child->next;
  }


  if (title == NULL)
    title = (xmlChar*)empty;
  if (subtitle == NULL)
    subtitle = (xmlChar*)empty;
  if (desc == NULL)
    desc = (xmlChar*)empty;
  if (date == NULL)
    date = (xmlChar*)empty;
  if (director == NULL)
    director = (xmlChar*)empty;
  
  end = strmov(query,"INSERT IGNORE INTO programme values(");
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, channel, strlen(channel));
  *end++ = '\'';
  *end++ = ',';
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, start, 14);
  *end++ = '\'';
  *end++ = ',';
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, stop,14);
  *end++ = '\'';
  *end++ = ',';
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, (char*)title, strlen((char*)title));
  *end++ = '\'';
  *end++ = ',';
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, (char*)subtitle, strlen((char*)subtitle));
  *end++ = '\'';
  *end++ = ',';
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, (char*)desc, strlen((char*)desc));
  *end++ = '\'';
  *end++ = ',';
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, (char*)date, strlen((char*)date));
  *end++ = '\'';
  *end++ = ',';
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, category, strlen(category));
  *end++ = '\'';
  *end++ = ',';
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, (char*)director, strlen((char*)director));
  *end++ = '\'';
  *end++ = ',';
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, presenter, strlen(presenter));
  *end++ = '\'';
  *end++ = ',';
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, actors, strlen(actors));
  *end++ = '\'';
  *end++ = ',';
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, rating, strlen(rating));
  *end++ = '\'';
  *end++ = ',';
  *end++ = '\'';
  end += mysql_real_escape_string(mysql, end, length, strlen(length));
  *end++ = '\'';
  *end++ = ')';

  if (mysql_real_query(mysql,query,(unsigned int) (end - query)))
    {
      fprintf(stderr, "Failed to insert row, Error: %s\n",
	      mysql_error(mysql));
    }

  // free(channel);
  // free(start);
  // free(stop);
  // free(length);
  /* free(title); */
  if (title != (xmlChar*)empty)
    free(title);
  if (subtitle != (xmlChar*)empty)
    free(subtitle);
  if (desc != (xmlChar*)empty)
    free(desc);
  if (date != (xmlChar*)empty)
    free(date);
  if (director != (xmlChar*)empty)
    free(director);
  // free(desc);
  // free(date);
}

int		parse(char *file, char *source, char *country)
{
  MYSQL		*conn;
  xmlDocPtr	doc;
  xmlNodePtr	racine;
  int		countChannel = 0;
  int		countProgramme = 0;

  printf("[%s] : ", file);
  conn = mysql_init(NULL);

  if(mysql_real_connect(conn, "127.0.0.1", "user", "password", "programmetv", 0, NULL, 0))
    {

      // xmlKeepBlanksDefault(0);
      doc = xmlParseFile(file);
      if (doc == NULL) {
	fprintf(stderr, "\nDocument XML invalide\n");
	return (EXIT_FAILURE);
      }
      // Récupération de la racine
      racine = xmlDocGetRootElement(doc);
      if (racine == NULL) {
	fprintf(stderr, "\nDocument XML vierge\n");
	xmlFreeDoc(doc);
	return (EXIT_FAILURE);
      }
      if (strcmp((char*)racine->name, "tv") == 0) {
	for (racine = racine->children; racine != NULL; racine = racine->next) {
	  if (strcmp((char*)racine->name, "channel") == 0) {
	    parseChannel(conn, racine, source, country);
	    countChannel++;
	  }
	  else if (strcmp((char*)racine->name, "programme") == 0) {
	    parseProgramme(conn, racine);
	    countProgramme++;
	  }
	}
	printf("%d channels | %d programmes ... ", countChannel, countProgramme);

	// Supprime les programmes sans chaines
	mysql_query(conn, "DELETE `programme`.* FROM `programme` LEFT JOIN `channel` ON `channel`.`id` = `programme`.`channel` WHERE `channel`.`id` IS NULL");
	// Supprime les programmes anterieurs a la veille
	// mysql_query(conn, "DELETE `programme`.* FROM `programme` LEFT JOIN `channel` ON `channel`.`id` = `programme`.`channel` WHERE `channel`.`id` IS NULL");
	mysql_query(conn, "OPTIMIZE TABLE `programme`");
	printf("optimized\n");
      }
      else {
	printf("\nBad XMLTV document\n");
      }
      xmlFreeDoc(doc);
    }
  else
    {
      printf("\nUnable to connect to the DB.\n");
    }
  mysql_close(conn);
  return (EXIT_SUCCESS);
}

  int		main(int argc, char **argv)
  {
    if (argc > 3)
      parse(argv[1], argv[2], argv[3]);
    else
      printf("ERROR: $> ./import xmltv.xml free france\n");
    return (EXIT_SUCCESS);
  }
