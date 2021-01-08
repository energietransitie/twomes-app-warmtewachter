import {
    IonPage,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonCardHeader,
    useIonViewWillEnter, useIonViewWillLeave, IonButton
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import LoadingComponent from "../components/LoadingComponent";
import {LocalStorage} from "../services/Storage";
import {GenerateJWTToken} from "../services/GenerateJWTToken";

const setItem = LocalStorage().setItem;
const generateJWTToken = GenerateJWTToken().generateJWTToken;

const Error: React.FC = () => {

    const [linkChecked, setLinkChecked] = useState(false);
    const [checkInterval, setCheckInterval] = useState<any>();
    const [intervalSet, setIntervalSet] = useState(false);
    const [timeoutSet, setTimeoutSet] = useState(false);


    //Hide tabbar on entering this page
    useIonViewWillEnter(() => {
        const tabBar = document.getElementById("tabBar");
        tabBar!.style.display = "none";
    })

    //Show tabbar on leaving this page
    useIonViewWillLeave(() => {
        const tabBar = document.getElementById("tabBar");
        tabBar!.style.display = "flex";
    })

    const forceThrough = () => {
        setItem('userID', '132312').then(() => {
            generateJWTToken().then(() => {
                window.location.href = '/home';
            });
        });
    }

    // Set interval for checking the firebase link
    useEffect(() => {
        if (!intervalSet) {
            setCheckInterval(setInterval(() => {
                var linkUsed = localStorage.getItem("firebaseTriggered");
                if (linkUsed == 'true') {
                    window.location.href = '/home';
                    setLinkChecked(true);
                    clearInterval(checkInterval);
                }
            }, 100));
            setIntervalSet(true);
        }
    })

    // If after two seconds no firebase link is found, show the error page.
    useEffect(() => {
        if(!timeoutSet) {
            setTimeout(() => {
                setLinkChecked(true);
            }, 2000)
            setTimeoutSet(true);
        }
    })

    if(linkChecked) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar className="gradientBackgroundColor">
                        <IonTitle>WarmteWachter</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonCard className="cardContent">
                        <IonCardHeader className="errorCardHeader">Welkom!</IonCardHeader>
                        <IonCardContent className="errorCardContent">Deze app is gebouwd voor het Twomes project. De app
                            kan
                            alleen gebruikt worden met
                            een link van de
                            organisatoren. Als u als testgebruiker bent aangewezen voor de WarmteWachter app, gebruik
                            dan de
                            link die u heeft gekregen via de e-mail.</IonCardContent>
                    </IonCard>
                    <IonButton onClick={() => forceThrough()}>Ik ben developer!</IonButton>
                </IonContent>
            </IonPage>
        )
    } else {
        return (
            <IonPage>
                <LoadingComponent showLoading={true}/>
            </IonPage>
        )
    }
}

export default Error;