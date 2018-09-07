function monster (id, atk, def, spd) {
    this.id = id;
    this.atk = atk;
    this.def = def;
    this.spd = spd;
}

module.exports = team => {
    return [
            new monster(team[0], team[5], team[10], team[15]),
            new monster(team[1], team[6], team[11], team[16]),
            new monster(team[2], team[7], team[12], team[17]),
            new monster (team[3], team[8], team[13], team[18]),
            new monster (team[4], team[9], team[14], team[19])
        ]
    }
}
