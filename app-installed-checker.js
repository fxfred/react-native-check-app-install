import { Linking, Platform } from 'react-native';
import { APP_LIST } from './app-list';
import CheckPackageInstallation from './android';

class AppInstalledChecker {

    static getAppList() {
        return Object.keys(APP_LIST);
    }
    // <<<<<<<< code here getPackageName
    static getPackageName(appName){
        let tmp = APP_LIST[appName] || {};
        return tmp.pkgName;
    }
    // >>>>>>>> code here getPackageName
    static checkPackageName(packagename) {
        return new Promise((resolve, reject) => {
            CheckPackageInstallation.isPackageInstalled(packagename, (isInstalled) => {
                resolve(isInstalled);
            });
        });
    }

    static checkURLScheme(proto, query) {
        return new Promise((resolve, reject) => {
            Linking
                .canOpenURL(proto + '://' + query || '')
                .then((isInstalled) => {
                    resolve(isInstalled);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static isAppInstalled(key) {
        return Platform.select({
            ios: () => { return this.isAppInstalledIOS(key); },
            android: () => { return this.isAppInstalledAndroid(key); }
        })();
    }

    static isAppInstalledAndroid(key) {
        return this.checkPackageName(key);
    }

    static isAppInstalledIOS(key) {
        return this.checkURLScheme(APP_LIST[key].urlScheme, APP_LIST[key].urlParams);
    }
}

export default AppInstalledChecker;
