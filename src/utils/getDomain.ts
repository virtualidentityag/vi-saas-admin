export const getDomainWithoutMainTenant = (mainTenant: string) =>
    window.location.host.replace(new RegExp(`^${mainTenant}.`, 'i'), '');
