using Microsoft.AspNetCore.Identity;

namespace fantasy_creature_adoption.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
    }
}