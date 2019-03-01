const electron = require('electron');
const url = require('url');
const path = require('path');

const {app,BrowserWindow,Menu,ipcMain} = electron;

//Set Environment
process.env.NODE_ENV ='production';

let mainWindow;
let addWindow;
//listen for the app to be ready
app.on('ready', function(){
    //create new window
    mainWindow = new BrowserWindow({});
    //load html into window
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname,'mainWindow.html'),
        protocol:'file:' ,
        slashes:true
    }));
    //Quit App when Closed
    mainWindow.on('closed',function(){
        app.quit();
    });
    //Build menu from templte
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});
//Handle Create Add Window
function createAddWindow(){
    //create new window
    addWindow = new BrowserWindow({
        width:300,
        height:200,
        title:'Add New Record'
    });
    //load html into window
    addWindow.loadURL(url.format({
        pathname:path.join(__dirname,'addWindow.html'),
        protocol:'file:' ,
        slashes:true
    }));
    //Garbage Collection handle
addWindow.on('close',function(){
    addWindow = null;

                                });
}
//catch item:add
ipcMain.on('item:add',function(e,item){
    console.log(item);
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
});
//Create Menu Template
const mainMenuTemplate = [
    {
        label: 'Click Here To Add',
        submenu:[
            {
                label: 'Add',
                click(){
                    createAddWindow();
                }
            },
            
            {
                label: 'Clear',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            
            {
                label: 'Quit',
                accelerator:process.platform == 'darwin' ? 'Command+Q':
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            },
        ]
    }
];

//if mac,add empty objects to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//Add developer tools items if not in production
if(process.env.NODE_ENV != 'production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[
            {
                label:'Toggle DevTools',
                accelerator:process.platform == 'darwin' ? 'Command+I':
                'Ctrl+I',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();

                }
            },
            {
                role : 'reload'
            }

        ]
    });
}