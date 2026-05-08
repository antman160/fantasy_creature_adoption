using System.ComponentModel.DataAnnotations;

namespace fantasy_creature_adoption.Server.DTOs.Match
{
    public class MatchRequestDto
    {
        public string? PreferredSpecies { get; set; }

        [Required]
        public string PreferredTemperament { get; set; } = string.Empty;

        public string? PreferredDiet { get; set; }

        [Required]
        public string HousingType { get; set; } = string.Empty;
    }
}