<template>
  <div>
    <mu-appbar title="Angry Goose" id="appbar">
      <mu-dialog id="course-dialog" :open="dialogSearch" @close="closeSearch">
        <h3>Course Selector</h3>
        <mu-switch :label="isGrad ? 'Graduate' : 'Undergraduate'" v-model="isGrad"/><br/>
        <mu-select-field id="dialog-term" v-model="term" :labelFocusClass="['label-foucs']" label="Select the Term">
          <mu-menu-item v-for="text,index in termList" :key="index" :value="index" :title="text" />
        </mu-select-field>
        <br/>
        <mu-picker :slots="departmentSlots" :visible-item-count="3" @change="departmentChange" :values="department"/>
        <mu-flat-button primary label="Confirm" @click="closeSearch" slot="actions"/>
      </mu-dialog>

      <mu-dialog id="login-dialog" :open="dialogLogin" @close="closeLogin">
        <mu-list>
          <mu-list-item title="UWaterloo QUEST" disabled>
            <mu-avatar slot="left" src="../../static/UW-logo.jpg"/>
          </mu-list-item>
        </mu-list>
        <mu-text-field class="login-input" label="QUEST-ID" labelFloat/><br/>
        <mu-text-field class="login-input" label="Password" hintText="Your Password" type="password" labelFloat/><br/>
        <mu-flat-button primary label="Login" @click="closeLogin" slot="actions"/>
      </mu-dialog>

      <mu-icon-button icon="account_circle" slot="left" @click="openLogin" />
      <mu-icon-button icon="search" slot="right" @click="openSearch"/>
    </mu-appbar>

    <div class="panel">
      <img src="../../static/logo.png">

      <h1>{{ msg }}</h1>

      <div id="course-board">
        <mu-card class="course-card" v-for="course in courseList" :key="course.id">
          <!--<mu-card-header title="Myron Avatar" subTitle="sub title">-->
          <!--<mu-avatar slot="left" icon="folder"/>-->
          <!--</mu-card-header>-->
          <mu-card-title :title="course.courseName" :subTitle="'Instructor:  ' + course.instructor" />
          <mu-divider/>
          <mu-table :showCheckbox="false">
            <mu-thead slot="header">
              <mu-tr>
                <mu-th class="course-table" tooltip="Time">Time</mu-th>
                <mu-th class="course-table" tooltip="Location">Location</mu-th>
              </mu-tr>
            </mu-thead>
            <mu-tbody>
              <mu-tr>
                <mu-td class="course-table">{{ course.time }}</mu-td>
                <mu-td class="course-table">{{ course.location }}</mu-td>
              </mu-tr>
            </mu-tbody>
          </mu-table>
          <mu-divider/>
          <p class="course-info">
            Enroll Number: {{ course.enrollNum }} / {{ course.capNum }}
          </p>
          <mu-linear-progress class="enroll-percentage" mode="determinate" :value="course.enrollNum / course.capNum * 100"/>
          <mu-card-actions>
            <mu-raised-button label="Cancel Enrollment" class="enroll-button enroll-enrolled-button" icon="assignment_turned_in" @click="openConfirm(course.id, course.courseName, true)" v-if="enrollList.indexOf(course.id) != -1"/>
            <mu-raised-button label="Full" class="enroll-button" icon="people" disabled v-else-if="course.enrollNum === course.capNum"/>
            <mu-raised-button label="Enroll" class="enroll-button" icon="shopping_cart" @click="openConfirm(course.id, course.courseName, false)" primary v-else=""/>
          </mu-card-actions>
        </mu-card>

        <mu-dialog :open="dialogConfirm" title="Confirm" @close="closeConfirm(false)">
          {{ dialogConfirmMsg }}
          <mu-flat-button slot="actions" @click="closeConfirm(false)" primary label="cancel"/>
          <mu-flat-button slot="actions" primary @click="closeConfirm(true)" label="confirm"/>
        </mu-dialog>

        <p>* Last Update: 2017/08/04 03:35:01</p>
        <p id="claim">Developped with <i class="material-icons">favorite</i> By Ruifan Yu</p>
      </div>
    </div>

    <mu-paper id="bottom-bar">
      <mu-bottom-nav :value="bottomNav" shift @change="handleChange">
        <mu-bottom-nav-item value="Course" title="Course" icon="class"/>
        <mu-bottom-nav-item value="Calendar" title="Calendar" icon="date_range"/>
        <!--<mu-bottom-nav-item value="books" title="Books" icon="books"/>-->
      </mu-bottom-nav>
    </mu-paper>
  </div>
</template>

<script>
  /* eslint quote-props: ["error", "as-needed", { "keywords": true, "unnecessary": false }] */
  const department = {
    'A': ['ACC', 'ACINTY', 'ACTSC', 'AFM', 'AHS', 'AMATH', 'ANTH', 'APPLS', 'ARBUS', 'ARCH', 'ARCHL', 'ARTS', 'ASTRN', 'AVIA'],
    'B': ['BASE', 'BE', 'BET', 'BIOL', 'BME', 'BUS'],
    'C': ['CHE', 'CHEM', 'CHINA', 'CIVE', 'CLAS', 'CM', 'CMW', 'CO', 'COGSCI', 'COMM', 'COMST', 'COOP', 'CRGC', 'CROAT', 'CS', 'CT'],
    'D': ['DAC', 'DEI', 'DRAMA', 'DUTCH'],
    'E': ['EARTH', 'EASIA', 'ECDEV', 'ECE', 'ECON', 'EFAS', 'ELPE', 'EMLS', 'ENBUS', 'ENGL', 'ENTR', 'ENVE', 'ENVS', 'ERS'],
    'F': ['FILM', 'FINE', 'FR'],
    'G': ['GBDA', 'GEMCC', 'GENE', 'GEOE', 'GEOG', 'GER', 'GERON', 'GGOV', 'GLOBAL', 'GRK', 'GS'],
    'H': ['HIST', 'HLTH', 'HRM', 'HUMN', 'HUMSC'],
    'I': ['INDEV', 'INTEG', 'INTERN', 'INTST', 'IS', 'ITAL', 'ITALST'],
    'J': ['JAPAN', 'JS'],
    'K': ['KIN', 'KOREA'],
    'L': ['LAT', 'LS'],
    'M': ['MATBUS', 'MATH', 'ME', 'MEDVL', 'MISC', 'MNS', 'MSCI', 'MTE', 'MTHEL', 'MUSIC'],
    'N': ['NANO', 'NATST', 'NE'],
    'O': ['OPTOM'],
    'P': ['PACS', 'PD', 'PDARCH', 'PDPHRM', 'PHARM', 'PHIL', 'PHS', 'PHYS', 'PLAN', 'PLCG', 'PMATH', 'PORT', 'PS', 'PSCI', 'PSYCH'],
    'Q': ['QIC'],
    'R': ['REC', 'REES', 'RELC', 'RS', 'RSCH', 'RUSS'],
    'S': ['SCBUS', 'SCI', 'SDS', 'SE', 'SEQ', 'SI', 'SMF', 'SOC', 'SOCE', 'SOCIN', 'SOCWK', 'SPAN', 'SPCOM', 'STAT', 'STV', 'SUSM', 'SVENT', 'SWK', 'SWREN', 'SYDE'],
    'T': ['TAX', 'TN', 'TOUR', 'TPM', 'TS'],
    'U': ['UN', 'UNIV', 'UU'],
    'V': ['VCULT'],
    'W': ['WATER', 'WHMIS', 'WKRPT', 'WS'],
  };

  export default {
    name: 'hello',
    data() {
      return {
        msg: 'Make QUEST great again',

        isGrad: true,
        term: 1,
        termList: ['Spring 2017', 'Fall 2017', 'Winter 2017'],

        dialogSearch: false,
        dialogLogin: false,

        // enrollment confirm dialog
        dialogConfirm: false,
        dialogConfirmMsg: '',
        isCancel: false,
        manipulateCourseName: '',
        manipulateCourseID: '',

        // course selector
        departmentSlots: [
          {
            width: '100%',
            textAlign: 'center',
            values: Object.keys(department),
          },
          {
            width: '100%',
            textAlign: 'center',
            values: department.A,
          },
        ],
        department: ['A', 'ACC'],
        departmentShort: 'A',
        departmentName: 'ACC',

        // bottom bar
        bottomNav: 'Course',
        bottomNavColor: 'Course',

        enrollList: ['CS798-2'],
        courseList: [
          {
            id: '0001',
            courseName: 'CS798-1 Introduction to Machine Learning',
            instructor: 'Shai Ben-David',
            time: '02:30-03:50 Mon Wed',
            location: 'DC 2568',
            enrollNum: 15,
            capNum: 25,
          },
          {
            id: '0002',
            courseName: 'STAT946 Introduction to Deep Learning',
            instructor: 'Ali Ghodsi',
            time: '02:30-03:50 Mon Wed',
            location: 'DC 2568',
            enrollNum: 25,
            capNum: 25,
          },
          {
            id: '0003',
            courseName: 'CS798-2 Optimization for Machine Learning',
            instructor: 'YaoLiang Yu',
            time: '02:30-03:50 Mon Wed',
            location: 'DC 2568',
            enrollNum: 3,
            capNum: 15,
          },
          {
            id: '0004',
            courseName: 'CS698 Big Data Infrastructure',
            instructor: 'Jimmy Lin',
            time: '02:30-03:50 Mon Wed',
            location: 'DC 2568',
            enrollNum: 35,
            capNum: 45,
          },
        ],
      };
    },
    methods: {
      handleChange(val) {
        this.bottomNav = val;
      },

      openSearch() {
        this.dialogSearch = true;
      },
      closeSearch() {
        this.dialogSearch = false;
      },

      openLogin() {
        this.dialogLogin = true;
      },
      closeLogin() {
        this.dialogLogin = false;
      },

      openConfirm(courseID, courseName, isCancel) {
        this.dialogConfirm = true;
        this.manipulateCourseID = courseID;
        this.manipulateCourseName = courseName;
        this.isCancel = isCancel;
        if (isCancel) {
          this.dialogConfirmMsg = `Are you sure to cancel the enrollment for ${courseName} ?`;
        } else {
          this.dialogConfirmMsg = `Are you sure to enroll ${courseName} ?`;
        }
      },
      closeConfirm(isContinue) {
        this.dialogConfirm = false;
        if (isContinue) {
          if (this.isCancel) {
            this.enrollList.splice(this.enrollList.indexOf(this.manipulateCourseID), 1);
          } else {
            this.enrollList.push(this.manipulateCourseID);
          }
        }
      },

      departmentChange(value, index) {
        if (index === 0) {
          this.departmentShort = value;
          const arr = department[value];
          this.departmentSlots[1].values = arr;
          this.departmentName = arr[0];
        } else {
          this.departmentName = value;
        }
        this.department = [this.departmentShort, this.departmentName];
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  img {
    width: 36%;
    max-width: 300px;
  }

  html {
    height: 100%;
  }

  body {
    min-height: 100%;
  }

  .panel {
    margin-top: 56px;
    margin-bottom: 56px;
  }

  #bottom-bar {
    width: 100%;
    bottom: 0;
    position: fixed;
  }

  .course-card {
    width: 90%;
    margin: auto;
    margin-bottom: 1em;
    box-shadow: 0px 0px 0px 0px #DDDDDD;
    transition: box-shadow .2s ease-in-out;
  }

  .course-card:hover{
    box-shadow: 0px 0px 5px 5px #DDDDDD;
  }

  .enroll-button {
    width: 70%;
  }

  /*.enroll-full-button {*/
    /*background-color: #ff4081;*/
    /*color: #fff;*/
  /*}*/

  .enroll-enrolled-button {
    background-color: #a4c639;
    color: #fff;
  }

  #appbar {
    top: 0;
    position: fixed;
    width: 100%;
  }

  .enroll-percentage {
    width: 80%;
    margin:auto;
  }

  .course-info {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .course-table {
    text-align: center;
    height: 48px;
  }

  #course-dialog {
    padding: 16px 16px 10px;
  }

  #dialog-term {
    width: 100%;
  }

  #claim {
    font-size: 0.75em;
    color: #AAAAAA;
  }

  #claim i {
    font-size: 0.85em;
    color: red;
  }

  .login-input {
    width: 95%;
  }
</style>
