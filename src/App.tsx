import React, {useEffect, useState} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {
    IonApp,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs
} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Sensors from './pages/Sensors';
import Settings from "./pages/Settings";
import Instructions from "./pages/Instructions";
import {LocalStorage} from "./services/Storage";
import {Icons} from "./components/Icons";
import API from "./api/Calls";
import {Plugins} from "@capacitor/core";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

// /* Basic CSS for apps built with Ionic */
// import '@ionic/react/css/normalize.css';
// import '@ionic/react/css/structure.css';
// import '@ionic/react/css/typography.css';
//
// /* Optional CSS utils that can be commented out */
// import '@ionic/react/css/padding.css';
// import '@ionic/react/css/float-elements.css';
// import '@ionic/react/css/text-alignment.css';
// import '@ionic/react/css/text-transformation.css';
// import '@ionic/react/css/flex-utils.css';
// import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.scss';
import './theme/main.scss';

import {FirebaseDynamicLinks} from "@ionic-native/firebase-dynamic-links";

var HomeIcon = Icons().HomeIcon();
var DashboardIcon = Icons().DashboardIcon();
var SensorIcon = Icons().SensorIcon();

const setItem = LocalStorage().setItem;
const getItem = LocalStorage().getItem;
const CryptoJS = require('crypto-js');
const {Device} = Plugins;
const jwt = require('jsonwebtoken');

const App: React.FC = () => {

    const [tokenChecked, setTokenChecked] = useState(false);

    FirebaseDynamicLinks.onDynamicLink().subscribe((data: any) => {
        console.log("dynamic Link triggered");
        console.log("data: " + JSON.stringify(data));
        var url = data.deepLink;
        var id = url.split('https://app.twomes.warmtewachter/')[1];
        console.log("userID: " + id);
        setItem("userID", id);
    });

    useEffect(() => {
        if (!tokenChecked) {
            var senddata = {}
            //Get System UUID for API
            Device.getInfo().then((info: any) => {
                senddata = {
                    houseID: info.uuid.toString()
                }
                console.log(info.uuid.toString());
            })

            //Get encrypted key from API

            // API.database.sendDeviceToken(senddata).then((response: any) => {
            // var secret = CryptoJS.AES.decrypt(response.data.key, info.uuid.toString());
            var secret = "hallo"
            // Check if JWTToken exists and is still valid
            getItem("JWTToken").then((oldToken: any) => {
                if (oldToken == null || oldToken == "") {
                    generateJWTToken(secret);
                } else {
                    jwt.verify(oldToken, secret, (err: any, decoded: any) => {
                        console.log(decoded);
                        console.log(err);
                        if (decoded == undefined) {
                            generateJWTToken(secret);
                        }
                    });
                }
            });
            // }, (err) => {console.log(err)})
        }
    }, [])

    // Generate JWT token based on secret key
    const generateJWTToken = (secret: string) => {
        var houseID = "";

        getItem("userID").then((userID: any) => {
            houseID = userID
        });

        var data = {
            "houseID": houseID
        }
        var signedToken = jwt.sign(data, secret, {expiresIn: '168h'})

        console.log(signedToken);

        setItem("JWTToken", signedToken);
        setTokenChecked(true);
    }

    return (
        <IonApp>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route path="/home" component={Home} exact={true}/>
                        <Route path="/dashboard" component={Dashboard} exact={true}/>
                        <Route path="/sensors" component={Sensors}/>
                        <Route path="/settings" component={Settings} exact={true}/>
                        <Route path="/instructions" component={Instructions} exact={true}/>
                        <Route path="/" render={() => <Redirect to="/home"/>} exact={true}/>
                    </IonRouterOutlet>
                    <IonTabBar slot="bottom" id="tabBar">
                        <IonTabButton tab="home" href="/home">
                            {HomeIcon}
                        </IonTabButton>
                        <IonTabButton tab="dashboard" href="/dashboard">
                            {DashboardIcon}
                        </IonTabButton>
                        <IonTabButton tab="sensors" href="/sensors">
                            {SensorIcon}
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonReactRouter>
        </IonApp>
    )
};

export default App;
