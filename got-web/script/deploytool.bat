rem set ARGS=
title deploytool
color 0b
java -Xms256m -Xmx1024m -Djava.ext.dirs="web\WEB-INF\lib;%JAVA_HOME%\jre\lib\ext" -cp .; cn.got.platform.fw.deploy.DeployUtil %1 %2 %3 %4 %5 %6 %7 %8
pause