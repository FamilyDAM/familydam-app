#!/bin/sh
#
# FamilyDAM Java Application

. /etc/service.subr

prog_dir=`dirname \`realpath $0\``

name="FamilyDAM"
version="0.3.0"
description="A Digital Asset Manager for Families"
framework_version="2.1"
depends="java8"
webui=":9000/index.html"

prog_dir="$(dirname "$(realpath "${0}")")"
java_tmp_dir="${prog_dir}/tmp"
tmp_dir="/tmp/DroboApps/${name}"
pidfile="${tmp_dir}/pid.txt"

logfile="${tmp_dir}/familydam-log.txt"
statusfile="${tmp_dir}/familydam-status.txt"
errorfile="${tmp_dir}/familydam-error.txt"

daemon="${DROBOAPPS_DIR}/java8/bin/java"
jarfile="FamilyDAM-${version}.jar"
repository="/mnt/DroboFS/Shares/FamilyDAM/local"
java_opts=-Xmx1024m
sling_opts="-p 9000 -f ${logfile} -l DEBUG  -c ${repository}/familydam-home -Drepository.home=${repository}/familydam-home/repository"



start()
{
    # if this file doesn't exist, client connections get some ugly warnings.
    touch /var/log/lastlog

    if [ ! -d "${java_tmp_dir}" ]; then
      mkdir -p "${java_tmp_dir}"
    fi

    #copy jar to repository local
    #cp ${jarfile} ${repository}


    echo "${daemon}" ${java_opts} -jar ${prog_dir}/${jarfile} ${sling_opts}
    setsid "${daemon}" ${java_opts} -jar ${prog_dir}/${jarfile} ${sling_opts} &
    if [ $! -gt 0 ]; then
        local pid=$!
        echo "${pid}" > "${pidfile}"
        renice 19 "${pid}"
    fi
}



case "$1" in
  start)
    start_service
    ;;
  stop)
    stop_service
    ;;
  restart)
    stop_service
    sleep 3
    start_service
    ;;
  status)
    status
    ;;
  *)
    echo "Usage: $0 [start|stop|restart|status]"
    exit 1
    ;;
esac

