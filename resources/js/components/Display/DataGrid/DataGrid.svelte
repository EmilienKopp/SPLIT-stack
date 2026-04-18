<script lang="ts">
import { Grid } from "@svar-ui/svelte-grid"; 

const data = [{
        id: 1,
        city: "Amieshire",
        email: "Leora13@yahoo.com",
        firstName: "Ernest",
        lastName: "Schuppe",
        companyName: "Lebsack - Nicolas",
    },
    {
        id: 2,
        city: "Gust",
        email: "Mose_Gerhold51@yahoo.com",
        firstName: "Janis",
        lastName: "Vandervort",
        companyName: "Glover - Hermiston",
    },
];

const columns = [{
        id: "id",
        width: 50
    },
    {
        id: "city",
        width: 100,
        header: "City",
        footer: "City",
    },
    {
        id: "firstName",
        header: "First Name",
        footer: "First Name",
        width: 150,
    },
    {
        id: "lastName",
        header: "Last Name",
        footer: "Last Name",
        width: 150,
    },
    {
        id: "email",
        header: "Email",
        footer: "Email"
    },
    {
        id: "companyName",
        header: "Company",
        footer: "Company"
    },
];
</script>

<div class="w-full flex flex-col gap-4">
  <Grid {data} {columns} filterValues={{}} />
</div>

<style>
  :global(.wx-grid .wx-table-box) {
    width: auto!important;
  }
</style>