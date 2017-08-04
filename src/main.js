// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';

// import 'muse-components/styles/base.less';
// import appBar from 'muse-components/appBar';
// import iconButton from 'muse-components/iconButton';
// import paper from 'muse-components/paper';
// import bottomNav from 'muse-components/bottomNav';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import './less/museui-custom.less';
import App from './App';
import router from './router';

Vue.use(MuseUI);

Vue.config.productionTip = false;

// Components from MuseUI
// Vue.component(appBar.name, appBar);
// Vue.component(iconButton.name, iconButton);
// Vue.component(bottomNav.name, bottomNav);
// Vue.component(paper.name, paper);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
