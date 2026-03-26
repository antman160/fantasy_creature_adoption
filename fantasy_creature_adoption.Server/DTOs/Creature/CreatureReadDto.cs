namespace fantasy_creature_adoption.Server.DTOs.Creature
{
    public class CreatureReadDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Species { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Habitat { get; set; } = string.Empty;
        public string Temperament { get; set; } = string.Empty;
        public string Diet { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsAdopted { get; set; }
    }
}