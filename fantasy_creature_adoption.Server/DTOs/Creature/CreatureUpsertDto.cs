using System.ComponentModel.DataAnnotations;

namespace fantasy_creature_adoption.Server.DTOs.Creature
{
    public class CreatureUpsertDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Species { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Habitat { get; set; } = string.Empty;

        [Required]
        public string Temperament { get; set; } = string.Empty;

        [Required]
        public string Diet { get; set; } = string.Empty;

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public bool IsAdopted { get; set; } = false;
    }
}