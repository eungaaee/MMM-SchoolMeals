# School Launch Menu Module

![JavaScript](https://img.shields.io/badge/JavaScript-181717.svg?logo=javascript)
![GitHub repo size](https://img.shields.io/github/repo-size/av3lla/launch-menu-module)
[![GitHub](https://img.shields.io/github/license/av3lla/launch-menu-module)](https://mit-license.org/)

### Magic Mirror Module

A module for the [MagicMirror](https://github.com/MichMich/MagicMirror) to display a *school launch menu* using data from [Korea Ministry of Education](https://open.neis.go.kr/).

---

* ## Preview
![preview](.github/preview.png)

---

* ## Features
    * Today's menu
    * Kcal Info
    * Nutrition Info
    * Place of Origin Info

---

* ## Usage
    You need to install and configure the module for your MagicMirror.

    ### Setup
    Clone the module into your modules folder.
    ```shell
    cd ~/MagicMirror/modules && git clone https://github.com/Av3lla/launch-menu-module
    ```
    ### Configuration

    Add the module configuration to your `config.js` file.

    ```js
    {
    	module: 'Launch',
    	position: 'bottom_right',
    	config: {
            key: 'ApiKey',
            schoolName: 'SchoolNameInKorea',
            updateInterval: '1000 * 60 * 60',
    	}
    },
    ```

    | Option | Description | Default | Required |
    |---|---|---|---|
    | `key` | the API key from neis.| `null` | O |
    | `schoolName` | the name of school you want to get launch menu from. | `동양고등학교` | O |
    | `updateInterval` | change the update period in Milliseconds. | `1000*60*60` | X |

---

### NOTE

#### Known Issues
  * You have to change the *folder name* from `launch-menu-module` to `Launch`.