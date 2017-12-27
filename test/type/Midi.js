define(["helper/Basic", "Test", "Tone/type/Midi", "Tone/core/Tone",
"deps/teoria", "helper/Offline", "Tone/type/Time", "Tone/type/TransportTime",
"Tone/type/Ticks", "Tone/type/Frequency"],
	function (Basic, Test, Midi, Tone, teoria, Offline, Time, TransportTime, Ticks, Frequency) {

	describe("Midi", function(){

		Basic(Midi);

		context("Constructor", function(){

			it("can be made with or without 'new'", function(){
				var m0 = Midi();
				expect(m0).to.be.instanceOf(Midi);
				m0.dispose();
				var m1 = new Midi();
				expect(m1).to.be.instanceOf(Midi);
				m1.dispose();
			});

			it("can pass in a number in the constructor", function(){
				var midi = Midi(1);
				expect(midi).to.be.instanceOf(Midi);
				midi.dispose();
			});

			it("can pass in a string in the constructor", function(){
				var midi = Midi("1");
				expect(midi).to.be.instanceOf(Midi);
				midi.dispose();
			});

			it("can pass in a value and a type", function(){
				expect(Midi(128, "n").valueOf()).to.equal(36);
			});

			it("with no arguments evaluates to 0", function(){
				expect(Midi().valueOf()).to.equal(0);
			});

			it("is evaluated in equations and comparisons using valueOf", function(){
				expect(Midi(1) + 1).to.equal(2);
				expect(Midi(1) + Midi(1)).to.equal(2);
				expect(Midi(1) > Midi(0)).to.be.true;
				expect(+Midi(1)).to.equal(1);
			});

			it("can convert from Time", function(){
				expect(Midi(Time(0.01)).valueOf()).to.equal(43);
				expect(Midi(Time("128n")).valueOf()).to.equal(36);
				expect(Midi(Time(128, "n")).valueOf()).to.equal(36);
			});

			it("can convert from Midi", function(){
				expect(Midi(Midi(2)).valueOf()).to.equal(2);
				expect(Midi(Midi("64n")).valueOf()).to.equal(24);
				expect(Midi(Midi(64, "n")).valueOf()).to.equal(24);
			});

			it("can convert from Frequency", function(){
				expect(Midi(Frequency('C4')).valueOf()).to.equal(60);
				expect(Midi(Frequency("64n")).valueOf()).to.equal(24);
				expect(Midi(Frequency(64, "n")).valueOf()).to.equal(24);
			});

			it("can convert from TransportTime", function(){
				expect(Midi(TransportTime(0.01)).valueOf()).to.equal(43);
				expect(Midi(TransportTime("256n")).valueOf()).to.equal(48);
			});

			it("can convert from Ticks", function(){
				return Offline(function(Transport){
					expect(Midi(Ticks(Transport.PPQ)).valueOf()).to.equal(-24);
					expect(Midi(Ticks("4n")).valueOf()).to.equal(-24);
				});
			});
		});

		context("Conversions", function(){

			it("can convert frequencies into notes", function(){
				expect(Midi(48).toNote()).to.equal(teoria.Note.fromMIDI(48).scientific());
				expect(Midi(90).toNote()).to.equal(teoria.Note.fromMIDI(90).scientific());
				expect(Midi("C#4").toNote()).to.equal("C#4");
			});

			it("can convert note to midi values", function(){
				expect(Midi("C4").toMidi()).to.equal(teoria.note("C4").midi());
				expect(Midi("C#0").toMidi()).to.equal(teoria.note("C#0").midi());
				expect(Midi("A-4").toMidi()).to.equal(teoria.note("A-4").midi());
			});
		});

		context("transpose/harmonize", function(){

			it ("can transpose a value", function(){
				expect(Tone.Midi("A4").transpose(3).toMidi()).to.equal(72);
				expect(Tone.Midi("A4").transpose(-3).toMidi()).to.equal(66);
				expect(Tone.Midi(69).transpose(-12).valueOf()).to.equal(57);
			});

			it ("can harmonize a value", function(){
				expect(Tone.Midi("A4").harmonize([0, 3])).to.be.an("array");
				expect(Tone.Midi("A4").harmonize([0, 3]).length).to.equal(2);
				expect(Tone.Midi("A4").harmonize([0, 3])[0].toNote()).to.equal("A4");
				expect(Tone.Midi("A4").harmonize([0, 3])[1].toNote()).to.equal("C5");

				expect(Tone.Midi("A4").harmonize([-12, 0, 12])).to.be.an("array");
				expect(Tone.Midi("A4").harmonize([-12, 0, 12]).length).to.equal(3);
				expect(Tone.Midi("A4").harmonize([-12, 0, 12])[0].toNote()).to.equal("A3");
				expect(Tone.Midi("A4").harmonize([-12, 0, 12])[1].toNote()).to.equal("A4");
				expect(Tone.Midi("A4").harmonize([-12, 0, 12])[2].toNote()).to.equal("A5");
			});
		});

	});
});
