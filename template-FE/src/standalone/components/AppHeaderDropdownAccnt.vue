<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" href="javascript:void(0);">
      {{userName}}&ensp;
      <img  v-if="photo" :src="photo" class="rounded-circle" style="width: 36px; height: 36px;">
      <CAvatar v-else="" color="danger " text-color="white">{{initial}}</CAvatar>
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="fw-semibold py-2">
        Account
      </CDropdownHeader>
      <CDropdownItem href="/#/sc/profile"> <CIcon icon="cil-user" /> Profile </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem href="#" @click="logout()">
        <CIcon icon="cilAccountLogout" /> Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import avatar from '@/standalone/assets/images/avatars/8.jpg'
import api from "@/apis/CommonAPI"
export default {
  name: 'AppHeaderDropdownAccnt',
  data(){
    return {
      photo: null,
      initial:'AA',
      userName: 'User Name 1'
    }
  },
  async created(){
    this.getUser();
    // let dataUser = await api.scQueryApi('/api/common/user-info','POST' );
    // this.photo = dataUser.data.photo
    // this.initial = dataUser.data.firstName.toUpperCase().charAt(0);
    // this.initial += dataUser.data.lastName?dataUser.data.lastName.toUpperCase().charAt(0):'';
    // this.userName = dataUser.data.firstName+' '+dataUser.data.lastName;
    // // localstorage set
    // localStorage.setItem('userName', this.userName);
  },
  setup() {
    return {
      avatar: avatar,
      itemsCount: 42,
    }
  },
  methods:{
    logout(){      
      localStorage.id_token = '';
      localStorage.removeItem("token");
      window.location.href="/#/auth/login";
    },
    async getUser() {
      try {
        const response = await fetch('http://localhost:3000/api/user/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        this.userName = (data.user.name || '');
      } catch (e) {
        this.userName = 'User Name 1';
      }
    }
  }
}
</script>
