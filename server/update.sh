#!/bin/sh

./xml/mc2xml -f -D xml/dat/fr_tnt.dat -C xml/chl/fr_tnt.chl -u -U -o xml/tmp/fr_tnt.xml
./xml/mc2xml -f -D xml/dat/fr_canalsat.dat -C xml/chl/fr_canalsat.chl -u -U -o xml/tmp/fr_canalsat.xml
./xml/mc2xml -f -D xml/dat/fr_free.dat -C xml/chl/fr_free.chl -u -U -o xml/tmp/fr_free.xml
./xml/mc2xml -f -D xml/dat/fr_orange.dat -C xml/chl/fr_orange.chl -u -U -o xml/tmp/fr_orange.xml

./xml/mc2xml -f -D xml/dat/ch_dvb.dat -C xml/chl/ch_dvb.chl -u -U -o xml/tmp/ch_dvb.xml
./xml/mc2xml -f -D xml/dat/ch_dvbfr.dat -u -U -o xml/tmp/ch_dvbfr.xml

./xml/mc2xml -f -D xml/dat/es_dvb.dat -C xml/chl/es_dvb.chl -u -U -o xml/tmp/es_dvb.xml

./xml/mc2xml -f -D xml/dat/de_sat.dat -C xml/chl/de_sat.chl -u -U -o xml/tmp/de_sat.xml

./xml/mc2xml -f -D xml/dat/gb_sat.dat -C xml/chl/gb_sat.chl -u -U -o xml/tmp/gb_sat.xml
./xml/mc2xml -f -D xml/dat/gb_bbc.dat -C xml/chl/gb_bbc.chl -u -U -o xml/tmp/gb_bbc.xml
./xml/mc2xml -f -D xml/dat/ie_dvb.dat -C xml/chl/ie_dvb.chl -u -U -o xml/tmp/ie_dvb.xml

./xml/mc2xml -f -D xml/dat/it_dvb.dat -C xml/chl/it_dvb.chl -u -U -o xml/tmp/it_dvb.xml

./xml/mc2xml -f -D xml/dat/us_sat.dat -C xml/chl/us_sat.chl -u -U -o xml/tmp/us_sat.xml

# # ./mc2xml -f -D be_sat.dat -C be_sat.chl -u -U -o be_sat.xml a revoir
# ./mc2xml -f -D ch_dvb.dat -C ch_dvb.chl -u -U -o ch_dvb.xml
# # ./mc2xml -f -D ca_sat_east.dat -u -U -o ca_sat_east.xml
# # ./mc2xml -f -D ca_sat_west.dat -u -U -o ca_sat_west.xml
# ./mc2xml -f -D de_dvb.dat -C de_dvb.chl -u -U -o de_dvb.xml
# ./mc2xml -f -D es_dvb.dat -C es_dvb.chl -u -U -o es_dvb.xml
# ./mc2xml -f -D gb_sat.dat -C gb_sat.chl -u -U -o gb_sat.xml
# ./mc2xml -f -D it_dvb.dat -C it_dvb.chl -u -U -o it_dvb.xml
# # ./mc2xml -f -D us_sat.dat -u -U -o us_sat.xml

./xml/src/update xml/tmp/fr_canalsat.xml canalsat fr
./xml/src/update xml/tmp/fr_free.xml free fr
./xml/src/update xml/tmp/fr_orange.xml orange fr
./xml/src/update xml/tmp/fr_tnt.xml tnt fr
./xml/src/update xml/tmp/ch_dvbfr.xml dvb chfr
./xml/src/update xml/tmp/es_dvb.xml dvb es
./xml/src/update xml/tmp/de_sat.xml sat de
./xml/src/update xml/tmp/gb_sat.xml sat gb
./xml/src/update xml/tmp/gb_bbc.xml bbc gb
./xml/src/update xml/tmp/ie_dvb.xml ie_dvb gb
./xml/src/update xml/tmp/it_dvb.xml dvb it
./xml/src/update xml/tmp/us_sat.xml sat us

# ./xml/src/update xml/tmp/es_dvb.xml dvb es
# ./pTV be_sat.xml sat be a revoir
# ./pTV ca_sat_east.xml sat-east ca

# ./pTV ch_dvb.xml dvb ch
# ./pTV de_dvb.xml dvb de
# ./pTV es_dvb.xml dvb es
# ./pTV gb_sat.xml sat gb
# ./pTV it_dvb.xml dvb it

# ./pTV us_sat.xml sat us
