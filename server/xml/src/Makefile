##
## Makefile for  in /home/cyril/Documents/programmetv
## 
## Made by cyril morales
## Login   <cyril@epitech.net>
## 
## Started on  Fri Dec 23 15:31:18 2011 cyril morales
## Last update Fri Feb 10 01:23:37 2012 cyril morales
##

NAME = update

CC = gcc

CFLAGS = -W -Wall -Werror

LDFLAGS = `mysql_config --cflags --libs` `xml2-config --cflags --libs`

SRC = main.c

all:
	$(CC) $(CFLAGS) -o $(NAME) $(SRC) $(LDFLAGS)

clean:
	rm -f *~

fclean:	clean
	rm -f $(NAME)

re:	fclean all