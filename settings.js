var settings;

/*

	- NODE.JS Stand-alone application instance.
	
	Below are the generalized settings of where this application will be hosted. No database information is necessary since we've migrated over our database API.
	-Z.C. 10.16.2014

*/

global.namespace = "fara_fresnillo";

settings = {
  general: {
    appname: 'FARA: Fresnillo',
    env: 'prod',
    db: 'mssql',
    status: 'enable'
  },
  web: {
    weburl: '/fara_fresnillo'
  },
  app: {
    dir: {
      rootdir: __dirname,
      serverdir: __dirname + '/server',
      configdir: __dirname + '/server/config',
      controllerdir: __dirname + '/server/controllers',
      modelsdir: __dirname + '/server/models',
      viewsdir: __dirname + '/server/views',
      publicdir: __dirname + '/public_html',
      webdir: __dirname + '/public_html'
    }
  },
  console: {
    headertext: "****************************************\nFARA: Fresnillo\n****************************************"
  }
};

global.apps[global.namespace] = settings;

module.exports = settings;
